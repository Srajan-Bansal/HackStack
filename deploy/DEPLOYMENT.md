# HackStack AWS Deployment Guide (EC2 + Auto Scaling)

## Context
Deploy HackStack to AWS ap-south-1 (Mumbai) for testing. Verify end-to-end flow works, then shut down. Use micro/small instances to minimize cost. All 3 app services (http-backend, submission-webhook, executor) run on a single EC2 via docker-compose.

## Existing CI/CD
Images already pushed to Docker Hub on every `main` push:
- `srajanbansal/hackstack-http-backend:latest`
- `srajanbansal/hackstack-submission-webhook:latest`
- `srajanbansal/hackstack-executor:latest`
- `srajanbansal/hackstack-web:latest` (won't use — frontend goes to S3)

No ECR needed. EC2 just does `docker pull` from Docker Hub (public images).
CI also tags images with commit SHA (e.g., `:abc123`) for rollback — but `:latest` is what we use.

## Architecture

```
Users -> CloudFront -> S3 (frontend static files built by Vite)
      -> ALB:80 -> Auto Scaling Group [EC2 t3.small x1-3]
                    each EC2 runs docker-compose with:
                      - hackstack-http-backend (port 3000)
                      - hackstack-submission-webhook (port 3001)
                      - hackstack-executor (port 8081, privileged)
                          |
                    RDS db.t3.micro (Postgres 16)
                    ElastiCache cache.t3.micro (Redis 7)
                    EC2 t3.small (Kafka in Docker)
```

---

## Step 1: AWS Infrastructure (via Console)

### 1.1 Security Groups (in default VPC, ap-south-1)

| SG Name | Inbound Rules |
|---------|--------------|
| `hackstack-alb-sg` | 80 (anywhere — 0.0.0.0/0) |
| `hackstack-app-sg` | 22 (your IP), 3000 (from `hackstack-alb-sg`), 3001 (internal), 8081 (internal) |
| `hackstack-db-sg` | 5432 from `hackstack-app-sg` |
| `hackstack-redis-sg` | 6379 from `hackstack-app-sg` |
| `hackstack-kafka-sg` | 9092 from `hackstack-app-sg`, 22 (your IP) |

**Note:** All security groups have default outbound rule allowing all traffic (0.0.0.0/0). The ALB SG needs inbound 80 so users can reach it, and `hackstack-app-sg` allows port 3000 from the ALB SG so the ALB can forward traffic to the backend.

### 1.2 RDS (Postgres)
- Console -> RDS -> Create Database
- Engine: **PostgreSQL** (NOT Aurora PostgreSQL — Aurora is much more expensive)
- Template: **Free tier**
- Instance: db.t3.micro
- DB name: `hackstack`, Master user: `hackstack`, set a password
- VPC: default, Security group: `hackstack-db-sg`
- Public access: No
- Note the **endpoint** after creation (e.g., `hackstack.xxxxx.ap-south-1.rds.amazonaws.com`)
- Connection string: `postgresql://hackstack:<password>@<endpoint>:5432/hackstack`
- SSL/certificate stuff shown in the console is only for manual `psql` access — app containers connect without SSL within the VPC

### 1.3 ElastiCache (Redis)
- Console -> ElastiCache -> Create Redis cluster
- **IMPORTANT: Use "Cluster cache" creation method, NOT "Easy create"** (Easy create forces cluster mode + encryption which breaks standard Redis clients)
- Engine: **Redis OSS** (not Valkey)
- **Cluster mode: Disabled**
- **Multi-AZ: Disabled**
- **Auto-failover: Disabled**
- Node type: **cache.t3.micro** (not the default r7g.large — that's expensive)
- Number of replicas: **0**
- Scroll to Security section (on Step 2 "Advanced settings" page):
  - **Encryption in transit: Disabled**
  - **Encryption at rest: Disabled**
  - **Security group: `hackstack-redis-sg`**
- Logs: leave both **Disabled**
- Note the **Primary endpoint** after creation (e.g., `hackstack-redis.xxxxx.ng.0001.aps1.cache.amazonaws.com:6379`)
- For `.env`: `REDIS_URL=redis://<host>:6379` and `REDIS_HOST=<host-without-port>`
- Do NOT use the `clustercfg.*` endpoint — that's for cluster mode

### 1.4 Kafka EC2
- Console -> EC2 -> Launch Instance
- AMI: **Amazon Linux 2023** (uses `dnf` package manager, matches the setup script)
- Type: t3.small (Kafka needs ~1.5GB RAM)
- Security group: `hackstack-kafka-sg`
- Key pair: create/select one
- User data: paste contents of `deploy/setup-kafka.sh` into Advanced Details
- Note the **private IP** after launch (e.g., `172.31.x.x`) — use this for `KAFKA_BROKER`, NOT the public DNS
- App containers communicate with Kafka over the internal VPC network
- **After launch, verify Kafka advertised the correct IP:**
  ```bash
  ssh -i ~/.ssh/srajan.pem ec2-user@<kafka-public-dns>
  sudo docker inspect kafka | grep ADVERTISED
  # Should show: EXTERNAL://<private-ip>:9092
  # If the IP is empty or shows a container ID, the IMDSv2 metadata fetch failed.
  # Fix: stop/rm kafka, then run deploy/fix-kafka.sh (scp it first) with hardcoded private IP
  ```

---

## Step 2: Production Docker Compose

Already created at `deploy/docker-compose.prod.yml`. Uses env vars from `.env` — see `deploy/.env.example` for the template.

---

## Step 3: Set Up App EC2 + Create AMI

### 3.1 Launch EC2
- AMI: Amazon Linux 2023
- Type: t3.small (2GB RAM for 3 containers)
- Security group: `hackstack-app-sg`
- IAM role: None needed (Docker Hub is public pull)
- Storage: **20GB gp3** (single root volume only — delete any extra volumes, 8GB is too small for Docker images)

### 3.2 SSH in and configure
```bash
# SSH into the instance (use ec2-user, not root)
ssh -i ~/.ssh/srajan.pem ec2-user@<public-dns>

# Install Docker + Compose
sudo dnf update -y && sudo dnf install -y docker git
sudo systemctl start docker && sudo systemctl enable docker
sudo usermod -aG docker ec2-user
# IMPORTANT: Log out and SSH back in for docker group to take effect
exit

# SSH back in
ssh -i ~/.ssh/srajan.pem ec2-user@<public-dns>

# Install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Set up app directory
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

# Clone problems repo (needed as volume mount)
git clone https://github.com/Srajan-Bansal/hackstack-problems.git

# Copy docker-compose.prod.yml and .env from local machine (run from local terminal):
#   scp -i ~/.ssh/srajan.pem deploy/docker-compose.prod.yml ec2-user@<public-dns>:/home/ec2-user/app/
#   scp -i ~/.ssh/srajan.pem deploy/.env ec2-user@<public-dns>:/home/ec2-user/app/.env
#
# Or create .env directly on EC2:
#   cat > .env << 'EOF'
#   DATABASE_URL=postgresql://hackstack:<password>@<rds-endpoint>:5432/hackstack
#   REDIS_URL=redis://<elasticache-endpoint>:6379
#   REDIS_HOST=<elasticache-endpoint>
#   KAFKA_BROKER=<kafka-private-ip>:9092
#   JWT_SECRET=<your-secret>
#   FRONTEND_URL=http://localhost
#   EOF
#
# Note: FRONTEND_URL is a placeholder — update after CloudFront is set up

# Pull and run (migrations + seeding run automatically via entrypoint)
docker-compose -f docker-compose.prod.yml up -d
```

### 3.3 Verify it works
```bash
# Check container status
docker ps

# Check logs (should show migrations applied, Redis connected, Kafka ready)
docker logs app-http-backend-1

# Test endpoint (should return "Hello World!")
curl http://localhost:3000/
```

### 3.4 Create AMI
- Console -> EC2 -> select instance -> **Actions -> Image and templates -> Create image** (NOT "Create image from template")
- Name: `hackstack-app-v1`
- The AMI will have `FRONTEND_URL=http://localhost` — that's fine, update it later after CloudFront is set up

---

## Step 4: ALB + Target Group

### 4.1 Target Group
- Console -> EC2 -> Target Groups -> Create
- Target type: Instance, Name: `hackstack-tg`
- Protocol: HTTP, Port: 3000
- Health check: `GET /`
- Healthy threshold: 2
- Register your app EC2 instance

### 4.2 Application Load Balancer
- Console -> EC2 -> Load Balancers -> Create ALB
- Name: `hackstack-alb`
- Scheme: Internet-facing
- **Subnets: select ALL AZs (ap-south-1a, 1b, 1c)** — must match or cover the AZs used by the ASG, otherwise targets will show as "Unused"
- Security group: create `hackstack-alb-sg` with inbound port 80 from 0.0.0.0/0 (do NOT use the default SG — it blocks external traffic)
- Listener: HTTP:80 -> forward to `hackstack-tg`
- Note the **ALB DNS name** (e.g., `hackstack-alb-123456.ap-south-1.elb.amazonaws.com`)

---

## Step 5: Frontend -> S3 + CloudFront

### 5.1 Build locally (on your Windows machine, NOT on EC2)
```bash
cd HackStack-server
# Use the CloudFront URL (not ALB) to avoid mixed-content errors (HTTPS frontend calling HTTP ALB)
VITE_BACKEND_URL=https://<cloudfront-domain>.cloudfront.net bun run build --filter=web
# Output will be in apps/web/dist/
```

### 5.2 S3 Bucket
- Console -> S3 -> Create bucket (e.g., `hackstack-frontend`)
- **Uncheck "Block all public access"** and acknowledge the warning
- ACLs: disabled (default)
- Versioning: disabled
- Encryption: SSE-S3 (default)
- After creation, enable **static website hosting** (Properties tab -> Static website hosting -> Enable):
  - Index document: `index.html`
  - Error document: `index.html`
- Upload all contents of `apps/web/dist/` to the bucket

### 5.3 CloudFront
- Console -> CloudFront -> Create Distribution
- Distribution type: **Single website or app**
- Domain: leave empty (no custom domain)
- Origin: S3 bucket
- CloudFront will auto-create a bucket policy allowing only CloudFront to access S3 (more secure than public access). The policy looks like:
```json
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<your-bucket-name>/*",
            "Condition": {
                "ArnLike": {
                    "AWS:SourceArn": "arn:aws:cloudfront::<account-id>:distribution/<dist-id>"
                }
            }
        }
    ]
}
```
- **Do NOT add a separate public read policy** — the CloudFront policy is sufficient
- Custom error pages: 403 -> `/index.html` (200), 404 -> `/index.html` (200)
- Note the **CloudFront domain** (e.g., `d1234.cloudfront.net`)

### 5.4 Route API through CloudFront (avoids mixed-content HTTPS/HTTP errors)
- CloudFront uses HTTPS, but ALB is HTTP — browsers block mixed content
- Add a **second origin** for the ALB:
  - CloudFront -> Origins -> Create origin
  - Origin domain: `<ALB-DNS>`
  - Protocol: **HTTP only**
- Add a **behavior** for API routes:
  - CloudFront -> Behaviors -> Create behavior
  - Path pattern: `/api/*`
  - Origin: select the ALB origin
  - Viewer protocol policy: **HTTPS only**
  - Allowed HTTP methods: **GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE**
  - Cache policy: **CachingDisabled**
  - Origin request policy: **AllViewer**
- This routes `https://<cloudfront>/api/*` to the ALB on HTTP internally

### 5.5 Upload and invalidate
- Upload all contents of `apps/web/dist/` to S3 bucket root (**not** inside a `dist/` folder — files like `index.html` and `assets/` must be at the top level)
- Invalidate CloudFront cache: CloudFront -> Invalidations -> Create -> Path: `/*`

---

## Step 6: Auto Scaling + Launch Template

### 6.1 Launch Template
- Console -> EC2 -> Launch Templates -> Create
- AMI: `hackstack-app-v1` (from step 3.4)
- Instance type: t3.small
- Security group: `hackstack-app-sg`
- User data: paste contents of `deploy/app-user-data.sh`

### 6.2 Auto Scaling Group
- Console -> EC2 -> Auto Scaling Groups -> Create
- Launch template from above
- Subnets: same as ALB
- Attach to ALB target group
- Min: 1, Max: 3, Desired: 1
- Scaling policy: Target tracking -> Average CPU -> Target 70%

---

## Step 7: Final Wiring

1. Update `FRONTEND_URL` in `.env` on the EC2 to CloudFront domain (e.g., `https://d1234.cloudfront.net`)
2. Restart backend: `docker-compose -f docker-compose.prod.yml up -d`
3. Optionally create a new AMI (`hackstack-app-v2`) with the correct `FRONTEND_URL`
4. Test the full flow

---

## Estimated Cost (testing for a few hours)

| Resource | $/hr |
|----------|------|
| EC2 t3.small x 2 (app + kafka) | $0.052 |
| RDS db.t3.micro | $0.018 |
| ElastiCache cache.t3.micro | $0.018 |
| ALB | $0.027 |
| S3 + CloudFront | ~free |
| **Total** | **~$0.12/hr** |

Run for 3 hours of testing = ~$0.36. Entire day = ~$3.

---

## Verification (End-to-End)
1. Open CloudFront URL -> frontend loads
2. Sign up -> creates user in RDS
3. Log in -> JWT works, cookie set
4. View problems -> data from DB + Redis cache
5. Submit code -> Kafka message -> executor runs in isolate -> webhook updates DB
6. Check submission status -> ACCEPTED/REJECTED
7. Stress test: `hey -n 1000 -c 50 http://<ALB-DNS>/` -> watch ASG add instances

---

## Shutdown
See `deploy/SHUTDOWN.md` for the full teardown checklist.

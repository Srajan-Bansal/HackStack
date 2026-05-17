# HackStack AWS Architecture

## Traffic Flow

```
                         INTERNET
                            |
                            v
                  +-------------------+
                  |    CloudFront     |
                  |  (d2gb838nd9cz9l) |
                  +-------------------+
                     |             |
            /assets, /index.html  /api/*
                     |             |
                     v             v
              +-----------+   +-----------+
              |  S3 Bucket|   |    ALB    |
              | (frontend)|   |  (port 80)|
              +-----------+   +-----------+
                                   |
                          +--------+--------+
                          |  Target Group   |
                          |  (port 3000)    |
                          +--------+--------+
                                   |
                    +--------------+--------------+
                    |     Auto Scaling Group      |
                    |      (1-3 instances)         |
                    +--------------+--------------+
                                   |
              +--------------------+--------------------+
              |           EC2 t3.small (app)            |
              |         docker-compose.prod.yml         |
              |                                         |
              |  +-------------+ +-------------------+  |
              |  | http-backend| | submission-webhook|  |
              |  |  (port 3000)| |    (port 3001)    |  |
              |  +-------------+ +-------------------+  |
              |  +-----------------------------------+  |
              |  |       executor (port 8081)         |  |
              |  |         (privileged)               |  |
              |  +-----------------------------------+  |
              +--------------------+--------------------+
                    |              |              |
                    v              v              v
          +-----------+   +-----------+   +-----------+
          |    RDS     |   |ElastiCache|   | Kafka EC2 |
          | PostgreSQL |   |   Redis   |   | t3.small  |
          | t3.micro   |   | t3.micro  |   |           |
          | port 5432  |   | port 6379 |   | port 9092 |
          +-----------+   +-----------+   +-----------+
```

## Submission Flow

```
User submits code
       |
       v
CloudFront (/api/v1/createSubmission)
       |
       v
ALB -> http-backend
       |
       |  1. Creates Submission + TestCase records (PENDING) in RDS
       |  2. Publishes execution request to Kafka (code-executor topic)
       |
       v
Kafka (code-executor topic)
       |
       v
executor (consumes message)
       |
       |  1. Runs code in isolated sandbox
       |  2. Compares output with test cases from /hackstack-problems
       |  3. Publishes results to Kafka (code-results topic)
       |
       v
Kafka (code-results topic)
       |
       v
submission-webhook (consumes results)
       |
       |  1. Updates TestCase status (ACCEPTED/WRONG_ANSWER/TLE/etc.)
       |  2. After all test cases complete, updates Submission status
       |  3. Updates UserProblem status (SOLVED/ATTEMPTED)
       |
       v
RDS (final state stored)
       |
       v
Frontend polls for result -> shows ACCEPTED/REJECTED
```

## Security Groups

```
+------------------+     +------------------+
| hackstack-alb-sg |     | hackstack-app-sg |
|                  |     |                  |
| IN:  80 (0.0.0.0)|---->| IN: 3000 (ALB)  |
| OUT: all         |     |     22 (your IP) |
+------------------+     |     3001, 8081   |
                          | OUT: all         |
                          +--------+---------+
                                   |
                 +-----------------+-----------------+
                 |                 |                 |
                 v                 v                 v
        +------------+    +-------------+    +-------------+
        |hackstack-  |    |hackstack-   |    |hackstack-   |
        |  db-sg     |    | redis-sg    |    | kafka-sg    |
        |            |    |             |    |             |
        |IN: 5432    |    |IN: 6379     |    |IN: 9092     |
        |  (app-sg)  |    |  (app-sg)   |    |  (app-sg)   |
        |OUT: all    |    |OUT: all     |    |  22 (IP)    |
        +------------+    +-------------+    |OUT: all     |
                                             +-------------+
```

## Services & Endpoints

| Service | Type | Endpoint |
|---------|------|----------|
| CloudFront | CDN | `https://d2gb838nd9cz9l.cloudfront.net` |
| ALB | Load Balancer | `http://hackstack-alb-1320198893.ap-south-1.elb.amazonaws.com` |
| RDS | PostgreSQL 16 | `hackstack.c98um0qqealz.ap-south-1.rds.amazonaws.com:5432` |
| ElastiCache | Redis 7 | `hackstack-redis.kdwyzj.ng.0001.aps1.cache.amazonaws.com:6379` |
| Kafka EC2 | Kafka 3.7.1 | `172.31.38.157:9092` (private IP) |

## Key Connections

| From | To | Protocol | Purpose |
|------|----|----------|---------|
| CloudFront | S3 | HTTPS | Serve frontend static files |
| CloudFront | ALB | HTTP | Proxy `/api/*` requests |
| ALB | EC2:3000 | HTTP | Route to http-backend |
| http-backend | RDS | TCP:5432 | Database queries (Prisma) |
| http-backend | Redis | TCP:6379 | Caching |
| http-backend | Kafka | TCP:9092 | Publish code execution requests |
| executor | Kafka | TCP:9092 | Consume execution requests, publish results |
| executor | Redis | TCP:6379 | Caching |
| submission-webhook | Kafka | TCP:9092 | Consume execution results |
| submission-webhook | RDS | TCP:5432 | Update submission/test case status |

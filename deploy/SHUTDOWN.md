# AWS Shutdown Checklist

Tear down in this order to avoid dependency issues.

## 1. Compute & Networking
- [ ] Delete **Auto Scaling Group** (terminates all app EC2 instances)
- [ ] Delete **Launch Template**
- [ ] Delete **ALB** (Application Load Balancer)
- [ ] Delete **Target Group**
- [ ] Terminate **Kafka EC2** instance

## 2. Data Stores
- [ ] Delete **RDS** instance (skip final snapshot for test deployments)
- [ ] Delete **ElastiCache** Redis cluster

## 3. Frontend / CDN
- [ ] **Disable** CloudFront distribution (wait ~15 min for it to propagate)
- [ ] Delete CloudFront distribution
- [ ] Empty **S3** bucket (`aws s3 rm s3://hackstack-frontend --recursive`)
- [ ] Delete S3 bucket

## 4. Cleanup
- [ ] Deregister **AMI** (`hackstack-app-v1`)
- [ ] Delete associated **EBS snapshot** (find via AMI details before deregistering)
- [ ] Delete **Security Groups**: `hackstack-app-sg`, `hackstack-db-sg`, `hackstack-redis-sg`, `hackstack-kafka-sg`
- [ ] Delete **Key Pair** if created specifically for this deployment

## Quick CLI Teardown

```bash
# If you have resource IDs handy:
aws autoscaling delete-auto-scaling-group --auto-scaling-group-name hackstack-asg --force-delete
aws ec2 delete-launch-template --launch-template-name hackstack-app-lt
aws elbv2 delete-load-balancer --load-balancer-arn <alb-arn>
aws elbv2 delete-target-group --target-group-arn <tg-arn>
aws ec2 terminate-instances --instance-ids <kafka-instance-id>
aws rds delete-db-instance --db-instance-identifier hackstack-db --skip-final-snapshot
aws elasticache delete-cache-cluster --cache-cluster-id hackstack-redis
aws s3 rm s3://hackstack-frontend --recursive
aws s3 rb s3://hackstack-frontend
# CloudFront: disable first, wait, then delete
aws cloudfront get-distribution-config --id <dist-id>  # get ETag
aws cloudfront delete-distribution --id <dist-id> --if-match <etag>
```

# Deployment Guide

## Local Development Setup

### Using Docker Compose (Recommended)

```bash
cd kiran-mahi-jewellers
docker-compose up -d
```

This starts all services with proper networking and volumes.

### Manual Setup

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## AWS Production Deployment

### Step 1: Prerequisites
- AWS Account with appropriate permissions
- Terraform >= 1.0
- AWS CLI v2 configured
- GitHub repository secrets configured

### Step 2: Prepare Terraform

```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your configuration
```

### Step 3: Initialize S3 Backend for State

```bash
# Create S3 bucket for Terraform state
aws s3api create-bucket \
  --bucket kiran-mahi-terraform-state \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket kiran-mahi-terraform-state \
  --versioning-configuration Status=Enabled

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name terraform-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

### Step 4: Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Review changes
terraform plan -out=tfplan

# Apply configuration
terraform apply tfplan
```

### Step 5: Configure GitHub Secrets

Add to GitHub repository:

```
AWS_ROLE_ARN = arn:aws:iam::ACCOUNT-ID:role/github-actions-role
CLOUDFRONT_DISTRIBUTION_ID = (from terraform output)
API_URL = https://api.yourdomain.com
```

### Step 6: Push Code to Main Branch

```bash
git push origin main
```

GitHub Actions will automatically:
1. Run tests
2. Build Docker images
3. Push to ECR
4. Deploy to ECS
5. Invalidate CloudFront

## Post-Deployment Configuration

### 1. Create RDS Database Tables

After deployment, connect to RDS and run migrations:

```bash
# SSH into an ECS task or use a migration container
aws ecs execute-command \
  --cluster kiran-mahi-cluster \
  --task <task-id> \
  --container kiran-mahi-backend \
  --interactive \
  --command "npm run migrate"
```

### 2. Seed Initial Data

```bash
aws ecs execute-command \
  --cluster kiran-mahi-cluster \
  --task <task-id> \
  --container kiran-mahi-backend \
  --interactive \
  --command "npm run seed"
```

### 3. Configure Domain

- Update Route53 DNS records
- Verify ACM certificate in email
- Test HTTPS access

### 4. Monitor Deployment

```bash
# Check ECS service status
aws ecs describe-services \
  --cluster kiran-mahi-cluster \
  --services kiran-mahi-backend kiran-mahi-frontend

# View CloudWatch logs
aws logs tail /ecs/kiran-mahi-jewellers --follow
```

## Scaling & Performance

### Auto-Scaling
The infrastructure automatically scales based on:
- CPU Utilization > 70% → Add instances
- Memory Utilization > 80% → Add instances
- Min: 2 instances, Max: 4 instances

### Database Performance
- RDS Multi-AZ enabled for high availability
- Read replica configured for read-heavy operations
- CloudFront caching for static assets

### Cost Monitoring

```bash
# Enable AWS Cost Anomaly Detection
aws ce get-cost-anomaly-monitor

# Check current spending
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity DAILY \
  --metrics BlendedCost
```

## Rollback Procedure

### Rollback Terraform Changes

```bash
# If deployment fails, view previous state
terraform state list

# Rollback to previous version
terraform destroy -auto-approve

# Reapply with corrected configuration
terraform apply -auto-approve
```

### Rollback ECS Deployment

```bash
# Trigger a new deployment with previous image
aws ecs update-service \
  --cluster kiran-mahi-cluster \
  --service kiran-mahi-backend \
  --force-new-deployment
```

## Troubleshooting

### RDS Connection Issues
```bash
# Test connection from ECS task
aws ecs execute-command \
  --cluster kiran-mahi-cluster \
  --task <task-id> \
  --container kiran-mahi-backend \
  --interactive \
  --command "psql -h <rds-endpoint> -U postgres -d kiran_mahi_db"
```

### ECS Task Failures
```bash
# View task logs
aws logs get-log-events \
  --log-group-name /ecs/kiran-mahi-jewellers \
  --log-stream-name ecs/kiran-mahi-backend/<task-id>

# Check task definition
aws ecs describe-task-definition \
  --task-definition kiran-mahi-backend
```

### CloudFront Issues
```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id <dist-id> \
  --paths "/*"

# Check distribution status
aws cloudfront get-distribution \
  --id <dist-id>
```

## Environment-Specific Configuration

### Development
- Instance: db.t3.micro
- ECS Task CPU: 256
- ECS Task Memory: 512
- Desired Count: 1
- No caching

### Production
- Instance: db.t3.small (or larger)
- ECS Task CPU: 512
- ECS Task Memory: 1024
- Desired Count: 2-4
- CloudFront caching enabled

## Updates & Maintenance

### Updating Container Images

```bash
# Build and push new image
docker build -t <account>.dkr.ecr.us-east-1.amazonaws.com/kiran-mahi-backend:v2.0 .
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/kiran-mahi-backend:v2.0

# Update ECS service
aws ecs update-service \
  --cluster kiran-mahi-cluster \
  --service kiran-mahi-backend \
  --force-new-deployment
```

### Database Updates

```bash
# Create RDS snapshot before major updates
aws rds create-db-snapshot \
  --db-instance-identifier kiran-mahi-jewellers-db \
  --db-snapshot-identifier kiran-mahi-jewellers-db-backup-$(date +%s)

# Apply updates
# (RDS will handle the upgrade)
```

## Monitoring Dashboard

Create CloudWatch Dashboard:

```bash
aws cloudwatch put-dashboard \
  --dashboard-name kiran-mahi-jewellers \
  --dashboard-body file://dashboard.json
```

Monitor:
- ECS CPU/Memory utilization
- RDS CPU/Connections
- ALB Target Health
- CloudFront Hit Ratio
- DynamoDB Consumed Capacity

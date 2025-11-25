# Kiran Mahi Jewellers - Code Configuration Guide

This document provides detailed instructions on what to change in the code for production deployment.

## Table of Contents
1. Backend Configuration
2. Frontend Configuration
3. Database Connection
4. AWS Services Integration
5. Environment Variables
6. Deployment Checklist

---

## 1. Backend Configuration

### 1.1 Database Connection

**File**: `backend/src/config/database.js`

**What to change**:

```javascript
// CURRENT (for local development)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,  // localhost
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // No SSL for local
  }
);

// CHANGE TO (for AWS RDS in production)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,  // your-rds-endpoint.rds.amazonaws.com
    port: 5432,  // Always 5432 for RDS
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,  // IMPORTANT for AWS RDS
        rejectUnauthorized: false  // Allows self-signed certs
      }
    },
    pool: {
      max: 20,     // Increase for production
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,  // Disable in production for performance
  }
);
```

**How to update**:
1. The RDS endpoint will be provided by Terraform (in `terraform output`)
2. Update `.env` file with actual RDS endpoint
3. Remove `rejectUnauthorized: false` after SSL certificate is properly installed

### 1.2 CORS Configuration

**File**: `backend/src/index.js`

**What to change**:

```javascript
// CURRENT (for local development)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// CHANGE TO (for production)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400  // Cache preflight for 24 hours
}));
```

**Environment variable**:
```
FRONTEND_URL=https://yourdomain.com
```

### 1.3 Authentication Configuration

**File**: `backend/src/middleware/auth.js`

**What to check**:
- JWT_SECRET must be strong and secret
- JWT_EXPIRY should be adjusted based on security needs

```javascript
// In production, use strong secrets from Secrets Manager
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,  // Must be > 32 characters
    { 
      expiresIn: process.env.JWT_EXPIRY || '7d',
      algorithm: 'HS256'  // Ensure secure algorithm
    }
  );
};
```

**Environment variables**:
```
JWT_SECRET=your-very-long-secure-random-string-at-least-32-characters
JWT_EXPIRY=7d
```

### 1.4 DynamoDB Configuration

**File**: `backend/src/config/dynamodb.js`

**What to change**:

```javascript
// CURRENT (local with endpoint)
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMODB_REGION || 'us-east-1',
  endpoint: 'http://localhost:8000'  // Only for local
});

// CHANGE TO (AWS production)
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMODB_REGION || 'us-east-1'
  // Remove endpoint for production (uses AWS endpoints)
});
```

**Environment variables**:
```
DYNAMODB_REGION=us-east-1
DYNAMODB_CACHE_TABLE=kiran-mahi-cache
DYNAMODB_SESSIONS_TABLE=kiran-mahi-sessions
```

### 1.5 Logging Configuration

**File**: `backend/src/index.js`

**What to add for production**:

```javascript
const morgan = require('morgan');

// Use JSON format for CloudWatch integration
app.use(morgan('combined', {
  skip: (req) => req.path === '/health'  // Don't log health checks
}));

// Add structured logging
const logger = {
  info: (msg, meta) => {
    console.log(JSON.stringify({ level: 'INFO', msg, ...meta }));
  },
  error: (msg, meta) => {
    console.log(JSON.stringify({ level: 'ERROR', msg, ...meta }));
  }
};
```

### 1.6 Error Handling

**File**: `backend/src/middleware/errorHandler.js`

**What to change**:

```javascript
// DEVELOPMENT
if (err.name === 'ValidationError') {
  return res.status(400).json({
    error: 'Validation failed',
    details: Object.values(err.errors).map(e => e.message),
  });
}

// PRODUCTION - Hide sensitive details
if (err.name === 'ValidationError') {
  if (process.env.NODE_ENV === 'production') {
    return res.status(400).json({
      error: 'Validation failed',
      // Don't expose implementation details
    });
  }
  // Development response above
}
```

---

## 2. Frontend Configuration

### 2.1 API URL Configuration

**File**: `frontend/src/services/api.js`

**What to change**:

```javascript
// CURRENT (local development)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// CHANGE TO (production with environment-specific URLs)
const API_BASE_URL = (() => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'https://api.yourdomain.com/api';
  }
  return 'http://localhost:5000/api';
})();
```

**Environment variables**:
```
# .env (local)
REACT_APP_API_URL=http://localhost:5000/api

# GitHub Actions (production)
API_URL=https://api.yourdomain.com
```

### 2.2 Token Management

**File**: `frontend/src/context/authStore.js`

**What to check**:

```javascript
// Ensure tokens are stored securely
const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('authToken'),
  
  // Consider using httpOnly cookies instead of localStorage for production
  // But localStorage works for SPA
  
  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      // Optional: Set expiry
      localStorage.setItem('authTokenExpiry', Date.now() + 7 * 24 * 60 * 60 * 1000);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authTokenExpiry');
    }
    set({ token, isAuthenticated: !!token });
  },
}));
```

### 2.3 API Interceptors

**File**: `frontend/src/services/api.js`

**What to add for production**:

```javascript
// Add error handling for token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add retry logic for failed requests
api.interceptors.response.use(null, async (error) => {
  const config = error.config;
  if (error.response?.status === 503 && !config._retry) {
    config._retry = true;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    return api(config);
  }
  return Promise.reject(error);
});
```

### 2.4 Build Configuration

**File**: `frontend/.env`

**What to add for production**:

```
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
```

### 2.5 Security Headers

**Note**: These should be set by CloudFront/ALB, but you can add to your app:

```javascript
// In your main App.js or index.js
if (process.env.NODE_ENV === 'production') {
  // These are typically handled by the server, but useful for reference
  // X-Content-Type-Options: nosniff
  // X-Frame-Options: SAMEORIGIN
  // X-XSS-Protection: 1; mode=block
}
```

---

## 3. Database Connection Details

### 3.1 RDS PostgreSQL Connection String

**Format**:
```
postgresql://username:password@host:port/database

Example:
postgresql://postgres:mypassword123@kiran-mahi-db.xxxxxxxxx.us-east-1.rds.amazonaws.com:5432/kiran_mahi_db
```

**Where to get these values**:
1. After Terraform deployment, run:
   ```bash
   terraform output rds_endpoint
   ```

2. Use these values:
   - **Host**: From terraform output (e.g., `kiran-mahi-db.xxxxxxxxx.us-east-1.rds.amazonaws.com`)
   - **Port**: Always `5432` for PostgreSQL
   - **Database**: From `db_name` variable (default: `kiran_mahi_db`)
   - **Username**: From `db_master_username` (default: `postgres`)
   - **Password**: From `db_master_password` in `terraform.tfvars`

### 3.2 Connection String in Code

**Backend .env**:
```
DB_HOST=kiran-mahi-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=kiran_mahi_db
DB_USER=postgres
DB_PASSWORD=ChangeMe123!!
```

### 3.3 DynamoDB Table Names

**From Terraform output**:
```bash
# These are automatically created:
DYNAMODB_CACHE_TABLE=kiran-mahi-cache
DYNAMODB_SESSIONS_TABLE=kiran-mahi-sessions
```

---

## 4. AWS Services Integration

### 4.1 ECR (Elastic Container Registry)

**What changes**:

The Docker images are automatically pushed to ECR by GitHub Actions.

**Get ECR URLs**:
```bash
terraform output ecr_backend_repository_url
terraform output ecr_frontend_repository_url
```

**Example output**:
```
123456789.dkr.ecr.us-east-1.amazonaws.com/kiran-mahi-jewellers-backend
123456789.dkr.ecr.us-east-1.amazonaws.com/kiran-mahi-jewellers-frontend
```

### 4.2 ECS Configuration

**In GitHub Actions Workflow** (`.github/workflows/backend-ci-cd.yml`):

```yaml
env:
  ECR_REPOSITORY: kiran-mahi-jewellers-backend  # Matches Terraform

jobs:
  push-to-ecr:
    env:
      ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
      IMAGE_TAG: ${{ github.sha }}
```

**What to change**: Nothing - it's automatically configured!

### 4.3 RDS Integration

**In Terraform** (`infrastructure/terraform/rds.tf`):

Already configured! The task definition uses environment variables:

```hcl
environment = [
  {
    name  = "DB_HOST"
    value = aws_db_instance.main.endpoint  # Automatic!
  }
]
```

### 4.4 CloudFront Configuration

**What changes**:

All static assets and API calls go through CloudFront for caching and performance.

**File**: `infrastructure/terraform/cloudfront.tf`

Already configured! No changes needed in application code.

### 4.5 Route53 DNS

**What to do**:

1. Update your domain registrar to point to Route53 nameservers
2. Terraform automatically creates the Route53 records

**Example**:
```
Domain: yourdomain.com
→ Route53 → ALB → ECS → Backend
→ CloudFront → ALB → ECS → Frontend
```

---

## 5. Environment Variables Checklist

### 5.1 Backend Environment Variables

Create `backend/.env`:

```bash
# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# RDS Database
DB_HOST=<terraform-output-rds-endpoint>
DB_PORT=5432
DB_NAME=kiran_mahi_db
DB_USER=postgres
DB_PASSWORD=<from-secrets-manager>

# DynamoDB
DYNAMODB_REGION=us-east-1
DYNAMODB_CACHE_TABLE=kiran-mahi-cache
DYNAMODB_SESSIONS_TABLE=kiran-mahi-sessions

# JWT
JWT_SECRET=<from-secrets-manager>
JWT_EXPIRY=7d

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<from-secrets-manager>
AWS_SECRET_ACCESS_KEY=<from-secrets-manager>

# Optional: Email, Payment Gateway, etc.
```

### 5.2 Frontend Environment Variables

Create `frontend/.env`:

```bash
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENVIRONMENT=production
```

### 5.3 Terraform Variables

Create `infrastructure/terraform/terraform.tfvars`:

```hcl
aws_region           = "us-east-1"
environment          = "production"
app_name             = "kiran-mahi-jewellers"

# Database
db_instance_class    = "db.t3.small"      # Change from micro for production
db_allocated_storage = 50                 # Increase as needed
db_master_password   = "YourSecurePassword123!!"

# ECS
ecs_task_cpu         = 512                # Increase for better performance
ecs_task_memory      = 1024
ecs_desired_count    = 2                  # Always at least 2

# Domain
domain_name          = "yourdomain.com"
jwt_secret           = "YourVeryLongSecureRandomStringAtLeast32Characters"
```

---

## 6. Deployment Checklist

### Pre-Deployment

- [ ] Update all environment variables
- [ ] Change default passwords
- [ ] Configure AWS credentials
- [ ] Update CORS origins
- [ ] Set up SSL certificate
- [ ] Configure DNS (Route53)
- [ ] Test locally with Docker Compose
- [ ] Review security settings

### Infrastructure Deployment

```bash
cd infrastructure/terraform

# 1. Initialize
terraform init

# 2. Plan
terraform plan -out=tfplan

# 3. Review the plan carefully

# 4. Apply
terraform apply tfplan

# 5. Get outputs
terraform output
```

### Application Deployment

```bash
# 1. Push to main branch
git push origin main

# 2. GitHub Actions automatically:
#    - Builds Docker images
#    - Pushes to ECR
#    - Deploys to ECS
#    - Invalidates CloudFront

# 3. Monitor deployment
aws ecs describe-services \
  --cluster kiran-mahi-cluster \
  --services kiran-mahi-backend kiran-mahi-frontend

# 4. Check logs
aws logs tail /ecs/kiran-mahi-jewellers --follow
```

### Post-Deployment

- [ ] Test website functionality
- [ ] Verify SSL certificate
- [ ] Check CloudFront cache
- [ ] Monitor CloudWatch logs
- [ ] Test database connection
- [ ] Verify auto-scaling works
- [ ] Load test application
- [ ] Setup monitoring alerts

---

## 7. Common Changes Summary

| Item | Local Dev | Production |
|------|-----------|-----------|
| **DB Host** | localhost | RDS endpoint from Terraform |
| **DB Port** | 5432 | 5432 (same) |
| **DB SSL** | No | Yes, required |
| **API URL** | http://localhost:5000 | https://api.yourdomain.com |
| **Frontend URL** | http://localhost:3000 | https://yourdomain.com |
| **CORS Origin** | http://localhost:3000 | https://yourdomain.com |
| **JWT Secret** | Any string | Strong, from Secrets Manager |
| **DynamoDB Endpoint** | http://localhost:8000 | AWS endpoints (auto) |
| **Logging** | Console | CloudWatch (auto) |
| **Node Env** | development | production |

---

## 8. Troubleshooting

### Database Connection Fails

```bash
# Check security group allows ECS to RDS
aws ec2 describe-security-groups --group-ids sg-xxxxxxxx

# Verify RDS is accessible
aws rds describe-db-instances --db-instance-identifier kiran-mahi-jewellers-db

# Test connection string
psql -h <rds-endpoint> -U postgres -d kiran_mahi_db
```

### ECS Tasks Not Starting

```bash
# Check task definition
aws ecs describe-task-definition \
  --task-definition kiran-mahi-backend

# View task logs
aws logs get-log-events \
  --log-group-name /ecs/kiran-mahi-jewellers \
  --log-stream-name <stream-name>
```

### CloudFront Cache Issues

```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id <dist-id> \
  --paths "/*"
```

---

## 9. Production Security Checklist

- [ ] All secrets in AWS Secrets Manager
- [ ] SSL/TLS certificates valid
- [ ] Database encryption enabled
- [ ] VPC security groups properly configured
- [ ] RDS backup enabled (30 days)
- [ ] CloudWatch alarms configured
- [ ] WAF rules configured (optional)
- [ ] DDoS protection enabled (Shield)
- [ ] Secrets rotated regularly
- [ ] Code reviewed before deployment

---

For more details, refer to the main `README.md` and `DEPLOYMENT.md` files.

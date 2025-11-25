# Kiran Mahi Jewellers - Quick Start Guide

## 🚀 Getting Started (5 Minutes)

### Local Development with Docker Compose

```bash
# 1. Navigate to project
cd kiran-mahi-jewellers

# 2. Start all services
docker-compose up -d

# 3. Wait for services to start (30 seconds)
docker-compose logs -f

# 4. Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:5000
PostgreSQL: localhost:5432
DynamoDB: http://localhost:8000

# 5. Stop services
docker-compose down
```

## 📋 Manual Local Setup

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with local values
npm run dev
# Runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## 🌐 AWS Production Deployment (30 Minutes)

### 1. Prerequisites
```bash
# Install required tools
brew install terraform aws-cli  # macOS
# or apt-get install terraform awscli  # Linux

# Configure AWS
aws configure
# Enter your credentials when prompted
```

### 2. Setup Terraform Variables
```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values:
# - domain_name: your domain
# - db_master_password: secure password
# - jwt_secret: random 32+ character string
# - aws_region: your AWS region
```

### 3. Deploy Infrastructure
```bash
# Initialize Terraform
terraform init

# Review changes
terraform plan

# Deploy everything
terraform apply
# Type "yes" when prompted

# Save outputs
terraform output > outputs.txt
```

### 4. Configure GitHub
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - `AWS_ROLE_ARN` - your AWS role ARN
   - `CLOUDFRONT_DISTRIBUTION_ID` - from Terraform output
   - `API_URL` - your API domain

### 5. Deploy Application
```bash
# Push to main branch
git push origin main

# GitHub Actions automatically deploys:
# ✅ Runs tests
# ✅ Builds Docker images
# ✅ Pushes to ECR
# ✅ Deploys to ECS
# ✅ Updates CloudFront
```

## 🔑 Default Credentials

### Local Development
```
Frontend: http://localhost:3000
Backend: http://localhost:5000/api

Database:
  Host: localhost
  Port: 5432
  Name: kiran_mahi_db
  User: postgres
  Password: postgres
```

### Production (after deployment)
```
Website: https://yourdomain.com
API: https://api.yourdomain.com

Database: AWS RDS (endpoint from Terraform)
Cache: AWS DynamoDB (auto-created)
CDN: AWS CloudFront
DNS: AWS Route53
```

## 📝 Project Structure

```
kiran-mahi-jewellers/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # Database models
│   │   ├── middleware/        # Auth, error handling
│   │   ├── config/            # Database config
│   │   └── services/          # Utilities
│   └── package.json
├── frontend/                   # React web app
│   ├── src/
│   │   ├── pages/             # Products, Cart, etc.
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API client
│   │   ├── context/           # State management
│   │   └── styles/            # CSS files
│   └── package.json
├── infrastructure/
│   ├── terraform/             # AWS infrastructure
│   │   ├── main.tf            # Provider config
│   │   ├── vpc.tf             # Network setup
│   │   ├── rds.tf             # Database
│   │   ├── ecs.tf             # Container service
│   │   ├── alb.tf             # Load balancer
│   │   ├── cloudfront.tf      # CDN
│   │   └── variables.tf       # Variables
│   └── docker/                # Docker files
├── .github/workflows/         # CI/CD pipelines
├── docker-compose.yml         # Local development
├── README.md                  # Full documentation
├── DEPLOYMENT.md              # Deployment guide
└── CONFIGURATION.md           # Code changes needed
```

## 🛣️ API Routes

### Authentication
```
POST   /api/auth/register      - Create account
POST   /api/auth/login         - Login
GET    /api/auth/verify        - Verify token
```

### Products
```
GET    /api/products           - List all products
GET    /api/products/:id       - Get product details
POST   /api/products           - Create (admin only)
PUT    /api/products/:id       - Update (admin only)
DELETE /api/products/:id       - Delete (admin only)
```

### Shopping Cart
```
GET    /api/cart               - Get cart items
POST   /api/cart/add           - Add to cart
PUT    /api/cart/:itemId       - Update quantity
DELETE /api/cart/:itemId       - Remove item
DELETE /api/cart               - Clear cart
```

### Orders
```
POST   /api/orders             - Place order
GET    /api/orders             - Get user's orders
GET    /api/orders/:orderId    - Order details
POST   /api/orders/:orderId/cancel - Cancel order
PUT    /api/orders/:orderId    - Update status (admin)
```

### User Profile
```
GET    /api/users/profile      - Get profile
PUT    /api/users/profile      - Update profile
```

## 🌍 Frontend Pages

- `/` - Home page
- `/login` - Login form
- `/register` - Registration form
- `/products` - Product listing with filters
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout form
- `/orders` - Order history
- `/profile` - User profile

## 📊 Database Schema

### Users Table
- ID (UUID)
- Name, Email, Phone
- Address, City, State, ZipCode
- Password (hashed), Role
- Created/Updated timestamps

### Products Table
- ID (UUID)
- Name, Description, Category
- Metal Type, Weight, Purity
- Price, Quantity
- Images, Rating, Reviews
- SKU (unique)

### Orders Table
- ID (UUID), Order Number
- User ID, Total Amount
- Status, Payment Status
- Shipping/Billing Address
- Tracking Number

### Cart Table
- ID (UUID)
- User ID, Product ID
- Quantity, Price at add time

## ⚙️ Key Configuration Changes

### For Production:

1. **Backend Database** (`src/config/database.js`)
   - Change host from `localhost` to RDS endpoint
   - Enable SSL for RDS connection
   - Increase connection pool

2. **Frontend API URL** (`src/services/api.js`)
   - Change from `http://localhost:5000` to `https://api.yourdomain.com`

3. **CORS Settings** (`src/index.js`)
   - Change origin from `http://localhost:3000` to `https://yourdomain.com`

4. **Environment Variables**
   - Update `.env` with production values
   - Use AWS Secrets Manager for sensitive data

See `CONFIGURATION.md` for detailed changes.

## 🐛 Troubleshooting

### Frontend not connecting to backend
```bash
# Check API URL in frontend/.env
REACT_APP_API_URL=http://localhost:5000/api

# Check backend is running
curl http://localhost:5000/health
```

### Database connection failed
```bash
# Check RDS security group allows port 5432
# Verify environment variables in backend/.env
# Test connection manually:
psql -h $DB_HOST -U $DB_USER -d $DB_NAME
```

### Docker containers won't start
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild images
docker-compose build --no-cache
```

### ECS deployment failed
```bash
# View ECS logs
aws logs tail /ecs/kiran-mahi-jewellers --follow

# Check service status
aws ecs describe-services \
  --cluster kiran-mahi-cluster \
  --services kiran-mahi-backend
```

## 📚 Documentation

- **README.md** - Complete project overview
- **DEPLOYMENT.md** - Detailed deployment guide
- **CONFIGURATION.md** - Code changes needed for production
- **This file** - Quick start guide

## 🔒 Security Reminders

- ✅ Never commit `.env` files
- ✅ Use strong passwords for databases
- ✅ Rotate JWT secrets regularly
- ✅ Enable SSL/TLS for all connections
- ✅ Use AWS Secrets Manager for sensitive data
- ✅ Keep dependencies updated
- ✅ Enable CloudWatch monitoring
- ✅ Configure RDS backups

## 🚢 CI/CD Pipeline

GitHub Actions automatically:

1. **On pull request**: Runs tests and linting
2. **On push to main**:
   - Builds Docker images
   - Pushes to Amazon ECR
   - Deploys to ECS Fargate
   - Invalidates CloudFront cache
   - Sends deployment notifications

## 💰 Cost Estimation (per month)

- **RDS**: $10-50 (t3.micro/small)
- **ECS Fargate**: $20-100 (2-4 tasks)
- **ALB**: $15-25 (load balancer)
- **DynamoDB**: $5-20 (on-demand)
- **CloudFront**: $0-50 (data transfer)
- **Route53**: $0.50-5 (DNS queries)
- **Total**: ~$50-250 (development-level infrastructure)

Use cost calculator: https://calculator.aws/

## 🎯 Next Steps

1. [ ] Review README.md for full documentation
2. [ ] Setup local development with Docker Compose
3. [ ] Test all API endpoints
4. [ ] Configure AWS account and Terraform
5. [ ] Deploy infrastructure to AWS
6. [ ] Configure GitHub Actions secrets
7. [ ] Deploy application
8. [ ] Setup monitoring and alerts
9. [ ] Load test the application
10. [ ] Go live!

## 📞 Support & Help

For issues:
1. Check the troubleshooting section
2. Review log files (CloudWatch, Docker logs)
3. Check GitHub Issues
4. Refer to AWS documentation
5. Contact: support@kiranmahi.com

---

**Happy coding! 🎉**

# Kiran Mahi Jewellers - Project Documentation Index

## 📚 Documentation Overview

This project is a complete, production-ready e-commerce platform built with Node.js, React, and AWS services. This index will help you navigate all documentation.

---

## 🚀 Start Here

### For First-Time Users
1. **[QUICKSTART.md](./QUICKSTART.md)** ⭐
   - 5-minute local setup with Docker Compose
   - AWS deployment in 30 minutes
   - Basic troubleshooting

### For Detailed Understanding
2. **[README.md](./README.md)**
   - Complete project overview
   - Technology stack details
   - API endpoint documentation
   - Database schema
   - Architecture diagrams

### For Deployment to AWS
3. **[DEPLOYMENT.md](./DEPLOYMENT.md)**
   - Step-by-step AWS deployment
   - Terraform setup instructions
   - Post-deployment configuration
   - Monitoring and scaling
   - Rollback procedures

### For Code Configuration
4. **[CONFIGURATION.md](./CONFIGURATION.md)**
   - All required code changes for production
   - Environment variables
   - Database connection details
   - AWS services integration
   - Production security checklist

---

## 📁 Project Structure

```
kiran-mahi-jewellers/
│
├── backend/                          # Node.js + Express API
│   ├── src/
│   │   ├── routes/                  # API endpoints (auth, products, cart, orders, users)
│   │   ├── controllers/             # Business logic
│   │   ├── models/                  # Sequelize database models
│   │   ├── middleware/              # Authentication, error handling
│   │   ├── config/                  # Database & DynamoDB config
│   │   ├── services/                # Business services
│   │   └── utils/                   # Utility functions
│   ├── .env.example                 # Environment variables template
│   ├── package.json                 # Dependencies
│   └── src/index.js                 # Entry point
│
├── frontend/                         # React web application
│   ├── src/
│   │   ├── pages/                   # Page components (Login, Products, Cart, Checkout)
│   │   ├── components/              # Reusable components (Header, ProductCard)
│   │   ├── services/                # API client
│   │   ├── context/                 # State management (Zustand)
│   │   ├── styles/                  # CSS files
│   │   └── App.js                   # Root component
│   ├── package.json                 # Dependencies
│   └── public/                       # Static assets
│
├── infrastructure/
│   ├── terraform/                   # AWS Infrastructure as Code
│   │   ├── main.tf                  # Terraform provider configuration
│   │   ├── variables.tf             # Input variables
│   │   ├── outputs.tf               # Output values
│   │   ├── vpc.tf                   # VPC, subnets, gateways
│   │   ├── rds.tf                   # RDS PostgreSQL database
│   │   ├── dynamodb.tf              # DynamoDB tables
│   │   ├── ecr.tf                   # ECR repositories
│   │   ├── ecs.tf                   # ECS cluster & roles
│   │   ├── alb.tf                   # Application Load Balancer
│   │   ├── cloudfront.tf            # CloudFront CDN
│   │   ├── ecs_services.tf          # ECS services & task definitions
│   │   ├── secrets.tf               # Secrets Manager
│   │   ├── terraform.tfvars.example # Configuration template
│   │   └── README.md                # Terraform documentation
│   │
│   └── docker/
│       ├── Dockerfile.backend       # Backend container image
│       └── Dockerfile.frontend      # Frontend container image
│
├── .github/workflows/               # GitHub Actions CI/CD
│   ├── backend-ci-cd.yml           # Backend build, test, deploy
│   └── frontend-ci-cd.yml          # Frontend build, test, deploy
│
├── docker-compose.yml               # Local development environment
├── .gitignore                       # Git ignore rules
│
├── README.md                        # Main documentation
├── QUICKSTART.md                    # Quick start guide (THIS FILE)
├── DEPLOYMENT.md                    # AWS deployment guide
├── CONFIGURATION.md                 # Configuration & code changes
└── INDEX.md                         # This file

```

---

## 🎯 Common Tasks

### Development Tasks

#### ✅ Setup Local Development
```bash
# Option 1: Docker Compose (Recommended)
docker-compose up -d

# Option 2: Manual setup
cd backend && npm install && npm run dev
cd frontend && npm install && npm start
```
→ See [QUICKSTART.md](./QUICKSTART.md)

#### ✅ Add New Product
Backend: `POST /api/products` (admin only)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gold Ring",
    "category": "rings",
    "metal": "gold",
    "price": 15000,
    "quantity": 10,
    "purity": "22K"
  }'
```

#### ✅ Test API Endpoints
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Get products
curl http://localhost:5000/api/products

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer TOKEN" \
  -d '{"productId": "uuid", "quantity": 1}'
```

#### ✅ View Database
```bash
# PostgreSQL
psql -h localhost -U postgres -d kiran_mahi_db

# DynamoDB (local)
aws dynamodb scan --table-name kiran-mahi-cache \
  --endpoint-url http://localhost:8000
```

#### ✅ Run Tests
```bash
cd backend && npm test
cd frontend && npm test
```

---

### Deployment Tasks

#### ✅ Deploy to AWS
```bash
# 1. Prepare Terraform
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# 2. Deploy infrastructure
terraform init
terraform plan
terraform apply

# 3. Configure GitHub secrets
# (See DEPLOYMENT.md for details)

# 4. Push code
git push origin main
# GitHub Actions automatically deploys!
```
→ See [DEPLOYMENT.md](./DEPLOYMENT.md)

#### ✅ Update Application Code
```bash
# GitHub Actions automatically:
# 1. Builds Docker images
# 2. Pushes to ECR
# 3. Deploys to ECS
# 4. Invalidates CloudFront cache

# Just push to main branch
git add .
git commit -m "Your changes"
git push origin main
```

#### ✅ Scale Infrastructure
Edit `infrastructure/terraform/terraform.tfvars`:
```hcl
ecs_desired_count    = 4        # Increase from 2
ecs_task_cpu         = 512      # Increase from 256
ecs_task_memory      = 1024     # Increase from 512
db_instance_class    = "db.t3.small"  # Upgrade from micro
```

Then:
```bash
terraform plan
terraform apply
```

#### ✅ Monitor Application
```bash
# View logs
aws logs tail /ecs/kiran-mahi-jewellers --follow

# Check service status
aws ecs describe-services \
  --cluster kiran-mahi-cluster \
  --services kiran-mahi-backend kiran-mahi-frontend

# View metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=kiran-mahi-backend \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Average
```

---

## 🔧 Configuration Quick Reference

### Backend Environment Variables
File: `backend/.env`

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

DB_HOST=<RDS-ENDPOINT>
DB_PORT=5432
DB_NAME=kiran_mahi_db
DB_USER=postgres
DB_PASSWORD=<SECURE-PASSWORD>

DYNAMODB_REGION=us-east-1
DYNAMODB_CACHE_TABLE=kiran-mahi-cache
DYNAMODB_SESSIONS_TABLE=kiran-mahi-sessions

JWT_SECRET=<SECURE-SECRET>
JWT_EXPIRY=7d

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<YOUR-KEY>
AWS_SECRET_ACCESS_KEY=<YOUR-SECRET>
```

### Frontend Environment Variables
File: `frontend/.env`

```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENVIRONMENT=production
```

### Terraform Variables
File: `infrastructure/terraform/terraform.tfvars`

```hcl
aws_region           = "us-east-1"
environment          = "production"
db_master_password   = "YourSecurePassword123!!"
domain_name          = "yourdomain.com"
jwt_secret           = "YourLongSecureRandomString32+"
```

→ See [CONFIGURATION.md](./CONFIGURATION.md) for all variables and their purposes

---

## 🏗️ AWS Architecture

```
                    ┌─────────────────────┐
                    │    Route 53 DNS     │
                    │  yourdomain.com     │
                    └──────────┬──────────┘
                               │
                    ┌──────────v──────────┐
                    │   AWS CloudFront    │
                    │  (CDN, Caching)     │
                    └──────────┬──────────┘
                               │
                    ┌──────────v──────────────────┐
                    │ Application Load Balancer   │
                    │  (SSL/TLS, Routing, Health) │
                    └──┬──────────────────────┬───┘
                       │                      │
        ┌──────────────v──────┐   ┌─────────v──────────────┐
        │  ECS Frontend (2-4)  │   │  ECS Backend (2-4)      │
        │ React React App      │   │ Express API             │
        │ Port: 3000           │   │ Port: 5000              │
        └──────────────┬───────┘   └──────────┬──────────────┘
                       │                      │
        ┌──────────────v──────────────────────v──────┐
        │         AWS RDS PostgreSQL                  │
        │  • Multi-AZ High Availability               │
        │  • Read Replica for scaling                 │
        │  • 30-day automated backups                 │
        └────────────────────────────────────────────┘
        
        ┌────────────────────────────────┐
        │   AWS DynamoDB                 │
        │  • Cache Table                 │
        │  • Sessions Table              │
        │  • Auto-scaling On-Demand      │
        └────────────────────────────────┘
        
        ┌────────────────────────────────┐
        │  AWS ECR                       │
        │  • Container Images            │
        │  • Automated Scanning          │
        │  • Lifecycle Policies          │
        └────────────────────────────────┘
```

---

## 📊 Database Schema

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zipCode VARCHAR(10),
  country VARCHAR(100),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Products
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('rings', 'necklaces', 'bracelets', 'earrings', 'sets', 'anklets'),
  metal ENUM('gold', 'silver', 'platinum', 'mixed'),
  weight DECIMAL(10,2),
  purity VARCHAR(10),
  price DECIMAL(12,2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  imageUrl VARCHAR(255),
  imageUrls TEXT[],
  sku VARCHAR(255) UNIQUE,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  orderNumber VARCHAR(255) UNIQUE NOT NULL,
  userId UUID REFERENCES users(id),
  totalAmount DECIMAL(12,2) NOT NULL,
  status ENUM(...) DEFAULT 'pending',
  paymentStatus ENUM(...) DEFAULT 'pending',
  paymentMethod VARCHAR(50),
  shippingAddress JSONB,
  billingAddress JSONB,
  trackingNumber VARCHAR(255),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

→ See [README.md](./README.md) for complete schema

---

## 🚢 CI/CD Pipeline

### GitHub Actions Workflows

**Backend Pipeline** (`.github/workflows/backend-ci-cd.yml`)
1. ✅ Install dependencies
2. ✅ Run linter (ESLint)
3. ✅ Run tests (Jest)
4. ✅ Build Docker image
5. ✅ Push to AWS ECR
6. ✅ Deploy to ECS
7. ✅ Health check

**Frontend Pipeline** (`.github/workflows/frontend-ci-cd.yml`)
1. ✅ Install dependencies
2. ✅ Run tests
3. ✅ Build production bundle
4. ✅ Build Docker image
5. ✅ Push to AWS ECR
6. ✅ Deploy to ECS
7. ✅ Invalidate CloudFront cache

**Trigger**: Push to `main` or pull request

---

## 🔐 Security Features

- ✅ **SSL/TLS**: All traffic encrypted with AWS ACM
- ✅ **VPC**: Private subnets for databases
- ✅ **IAM Roles**: Least privilege principle
- ✅ **Secrets Manager**: Secure credential storage
- ✅ **Security Groups**: Port-based access control
- ✅ **JWT**: Secure API authentication
- ✅ **Password Hashing**: bcryptjs
- ✅ **CORS**: Origin-based validation
- ✅ **Environment-based Config**: No secrets in code

---

## 📈 Scaling & Performance

### Auto-Scaling
- ECS scales based on CPU (>70%) and Memory (>80%) utilization
- Min 2 instances, Max 4 instances
- Both frontend and backend auto-scale

### Caching
- CloudFront CDN caches all content
- API responses cached by CloudFront
- DynamoDB used for session/application caching

### Database
- RDS read replicas for read-heavy operations
- Connection pooling with 20 max connections
- Multi-AZ for high availability

### Cost Optimization
- Fargate Spot for non-critical tasks (70% savings)
- On-demand DynamoDB pricing
- CloudFront caching reduces origin requests

---

## 🐛 Troubleshooting

### Common Issues

**Frontend not connecting to API**
- Check `REACT_APP_API_URL` in frontend/.env
- Verify backend is running: `curl http://localhost:5000/health`
- Check browser console for CORS errors

**Database connection failed**
- Verify RDS endpoint in DB_HOST
- Check security group allows port 5432
- Confirm database credentials

**ECS tasks not starting**
- Check CloudWatch logs: `aws logs tail /ecs/kiran-mahi-jewellers`
- Verify task definition: `aws ecs describe-task-definition`
- Check Docker image exists in ECR

**CloudFront caching issues**
- Invalidate cache: `aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"`
- Check cache behaviors in distribution settings

→ See [DEPLOYMENT.md](./DEPLOYMENT.md) for more troubleshooting

---

## 📚 Learning Resources

### For Understanding the Code
- Backend: Express.js, Sequelize ORM, JWT
- Frontend: React, React Router, Zustand, Tailwind CSS
- Database: PostgreSQL, DynamoDB
- DevOps: Docker, Terraform, GitHub Actions

### For AWS Services
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/)

### For Development
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Sequelize Documentation](https://sequelize.org/)
- [Docker Documentation](https://docs.docker.com/)

---

## 🎯 Roadmap / Future Enhancements

- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Email notifications (order confirmation, shipping updates)
- [ ] User reviews and ratings
- [ ] Wishlist/favorites
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Advanced search and filtering
- [ ] Inventory management system
- [ ] Multi-currency support
- [ ] AI recommendations
- [ ] WebSocket for real-time updates

---

## 📞 Support & Contact

For questions or issues:
1. Check relevant documentation file
2. Review GitHub Issues
3. Contact: support@kiranmahi.com
4. Check AWS CloudWatch logs

---

## 📄 License

Proprietary - Kiran Mahi Jewellers

---

## 🎉 Summary

You now have a complete, production-ready e-commerce platform!

**Next Step**: Choose your path:
- 👨‍💻 **Developer**: [QUICKSTART.md](./QUICKSTART.md) → [README.md](./README.md)
- 🚀 **DevOps**: [DEPLOYMENT.md](./DEPLOYMENT.md) → [CONFIGURATION.md](./CONFIGURATION.md)
- 📋 **Product Manager**: [README.md](./README.md) → [Project Structure](#-project-structure)

**Happy coding!** 🚀

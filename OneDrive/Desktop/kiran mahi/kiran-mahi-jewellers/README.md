# Kiran Mahi Jewellers - E-commerce Platform

A complete, production-ready e-commerce platform for Kiran Mahi Jewellers built with modern technologies and AWS services.

## Technology Stack

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: PostgreSQL (AWS RDS)
- **Caching**: DynamoDB
- **Authentication**: JWT
- **ORM**: Sequelize
- **Containerization**: Docker
- **Container Orchestration**: AWS ECS Fargate

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Infrastructure
- **Cloud Provider**: AWS
- **CDN**: CloudFront
- **Load Balancing**: Application Load Balancer (ALB)
- **Auto-scaling**: AWS Auto Scaling
- **DNS**: Route53
- **SSL/TLS**: AWS Certificate Manager
- **Infrastructure as Code**: Terraform
- **CI/CD**: GitHub Actions
- **Container Registry**: Amazon ECR

## Project Structure

```
kiran-mahi-jewellers/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   └── users.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   └── OrderItem.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── requestLogger.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── dynamodb.js
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Products.js
│   │   │   ├── Cart.js
│   │   │   └── Checkout.js
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── ProductCard.js
│   │   │   └── Footer.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   ├── authStore.js
│   │   │   └── cartStore.js
│   │   ├── styles/
│   │   └── App.js
│   ├── package.json
│   └── public/
├── infrastructure/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── vpc.tf
│   │   ├── rds.tf
│   │   ├── dynamodb.tf
│   │   ├── ecr.tf
│   │   ├── ecs.tf
│   │   ├── alb.tf
│   │   ├── cloudfront.tf
│   │   ├── ecs_services.tf
│   │   ├── secrets.tf
│   │   └── terraform.tfvars
│   └── docker/
│       ├── Dockerfile.backend
│       └── Dockerfile.frontend
├── .github/
│   └── workflows/
│       ├── backend-ci-cd.yml
│       └── frontend-ci-cd.yml
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- AWS Account
- Terraform
- Docker
- Git

### Local Development

#### 1. Clone the repository
```bash
git clone <repository-url>
cd kiran-mahi-jewellers
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your local configuration
npm run dev
```

#### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

#### 4. Using Docker Compose (Recommended for local development)
```bash
docker-compose up -d
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000
- PostgreSQL database on http://localhost:5432
- DynamoDB Local on http://localhost:8000

## Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# RDS PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kiran_mahi_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# DynamoDB
DYNAMODB_CACHE_TABLE=kiran-mahi-cache
DYNAMODB_SESSIONS_TABLE=kiran-mahi-sessions
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Schema

### User Table
- `id` (UUID, PK)
- `firstName` (String)
- `lastName` (String)
- `email` (String, unique)
- `password` (String, hashed)
- `phone` (String)
- `address` (String)
- `city` (String)
- `state` (String)
- `zipCode` (String)
- `country` (String)
- `role` (Enum: customer, admin)
- `isActive` (Boolean)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Product Table
- `id` (UUID, PK)
- `name` (String)
- `description` (Text)
- `category` (Enum: rings, necklaces, bracelets, earrings, sets, anklets)
- `metal` (Enum: gold, silver, platinum, mixed)
- `weight` (Decimal)
- `purity` (String)
- `price` (Decimal)
- `quantity` (Integer)
- `imageUrl` (String)
- `imageUrls` (Array)
- `sku` (String, unique)
- `rating` (Decimal)
- `reviews` (Integer)
- `isActive` (Boolean)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Cart Table
- `id` (UUID, PK)
- `userId` (UUID, FK)
- `productId` (UUID, FK)
- `quantity` (Integer)
- `priceAtAddTime` (Decimal)
- `isActive` (Boolean)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Order Table
- `id` (UUID, PK)
- `orderNumber` (String, unique)
- `userId` (UUID, FK)
- `totalAmount` (Decimal)
- `status` (Enum: pending, confirmed, processing, shipped, delivered, cancelled)
- `paymentStatus` (Enum: pending, completed, failed, refunded)
- `paymentMethod` (String)
- `shippingAddress` (JSONB)
- `billingAddress` (JSONB)
- `trackingNumber` (String)
- `estimatedDelivery` (Date)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### OrderItem Table
- `id` (UUID, PK)
- `orderId` (UUID, FK)
- `productId` (UUID, FK)
- `productName` (String)
- `quantity` (Integer)
- `unitPrice` (Decimal)
- `totalPrice` (Decimal)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify JWT token

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order details
- `POST /api/orders/:orderId/cancel` - Cancel order
- `PUT /api/orders/:orderId` - Update order status (admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Deployment to AWS

### Prerequisites
1. AWS Account with appropriate permissions
2. Terraform installed
3. AWS CLI configured
4. GitHub repository with secrets configured

### Step 1: Configure AWS Credentials

Set up AWS credentials for Terraform:

```bash
cd infrastructure/terraform
```

Create `terraform.tfvars`:

```hcl
aws_region           = "us-east-1"
environment          = "production"
db_master_password   = "your-secure-password"
jwt_secret           = "your-jwt-secret"
domain_name          = "your-domain.com"
```

### Step 2: Initialize Terraform

```bash
terraform init
```

### Step 3: Plan Deployment

```bash
terraform plan -out=tfplan
```

### Step 4: Apply Configuration

```bash
terraform apply tfplan
```

### Step 5: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

- `AWS_ROLE_ARN` - Your AWS role ARN
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID
- `API_URL` - Your API domain (e.g., https://api.example.com)

### Step 6: Push to Main Branch

The CI/CD pipeline will automatically:
1. Run tests
2. Build Docker images
3. Push to ECR
4. Deploy to ECS
5. Invalidate CloudFront cache

## Key Code Changes for Production

### 1. Backend - Database Connection String
Update in `backend/src/config/database.js`:

```javascript
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,  // RDS endpoint from Terraform output
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,  // Required for AWS RDS
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 10,
      min: 2,
    }
  }
);
```

### 2. Frontend - API URL Configuration
Update in `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.yourdomain.com/api';
```

### 3. Backend - CORS Configuration
Update in `backend/src/index.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true
}));
```

### 4. Environment Variables for ECS
The Terraform configuration automatically sets these in `ecs_services.tf`:

- `NODE_ENV` = production
- `DB_HOST` = RDS endpoint
- `DYNAMODB_CACHE_TABLE` = DynamoDB table name
- `DYNAMODB_SESSIONS_TABLE` = DynamoDB sessions table

## AWS Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CloudFront CDN                     │
│            (SSL/TLS, Global Distribution)           │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────v────────────────────────────────┐
│                 Route53 DNS                          │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────v────────────────────────────────┐
│        Application Load Balancer (ALB)               │
│         (SSL/TLS Termination, Routing)              │
└──┬─────────────────────────────────────┬────────────┘
   │                                     │
   v                                     v
┌──────────────────────┐      ┌──────────────────────┐
│   ECS Frontend       │      │    ECS Backend       │
│ (Auto-scaling 2-4)   │      │  (Auto-scaling 2-4)  │
│   Tasks in Fargate   │      │   Tasks in Fargate   │
└──────────────────────┘      └──┬───────────────────┘
                                 │
            ┌────────────────────┤
            │                    │
            v                    v
    ┌──────────────────┐  ┌──────────────────┐
    │ RDS PostgreSQL   │  │  DynamoDB        │
    │ (Multi-AZ)       │  │  (Cache/Session) │
    │ + Read Replica   │  └──────────────────┘
    └──────────────────┘
```

## Monitoring and Logging

### CloudWatch
- ECS cluster metrics
- Application logs in `/ecs/kiran-mahi-jewellers`
- RDS performance insights
- ALB metrics

### Auto-Scaling Policies
- CPU Utilization > 70% → Scale Up
- Memory Utilization > 80% → Scale Up
- Min instances: 2
- Max instances: 4

## Maintenance

### Database Backups
- Automated daily backups (30-day retention)
- Read replicas for high availability
- Multi-AZ deployment

### Updates
- Containerized deployments allow zero-downtime updates
- Rolling deployment with health checks
- Automatic rollback on failed deployments

## Cost Optimization

1. **RDS**: Use `db.t3.micro` for development, upgrade to `db.t3.small` for production
2. **ECS**: Use Fargate Spot for non-critical tasks (cost reduction up to 70%)
3. **DynamoDB**: On-demand pricing (pay per request)
4. **CloudFront**: Caching reduces origin requests
5. **ALB**: Pay only for processed requests

## Security Best Practices

- All traffic encrypted with SSL/TLS
- Secrets stored in AWS Secrets Manager
- RDS database not publicly accessible
- Security groups restrict traffic
- IAM roles follow least privilege principle
- Environment-based configuration

## Troubleshooting

### Backend not connecting to RDS
```bash
# Check RDS endpoint from Terraform output
aws rds describe-db-instances --db-instance-identifier kiran-mahi-jewellers-db

# Verify security group allows port 5432
aws ec2 describe-security-groups --group-ids sg-xxxxxxxx
```

### ECS tasks failing
```bash
# Check ECS task logs
aws ecs describe-tasks --cluster kiran-mahi-cluster --tasks <task-arn>

# View CloudWatch logs
aws logs tail /ecs/kiran-mahi-jewellers --follow
```

### CloudFront caching issues
```bash
# Invalidate cache
aws cloudfront create-invalidation --distribution-id <dist-id> --paths "/*"
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## License

Proprietary - Kiran Mahi Jewellers

## Support

For issues and support, please contact: support@kiranmahi.com

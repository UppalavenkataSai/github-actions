#!/bin/bash

# Kiran Mahi Jewellers - Setup Script
# This script initializes the entire project

set -e

echo "🚀 Setting up Kiran Mahi Jewellers Project"
echo "=========================================="

# Backend Setup
echo "📦 Setting up Backend..."
cd backend
npm install
cp .env.example .env
echo "✅ Backend setup complete!"

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend setup complete!"

# Terraform Setup
echo "☁️  Setting up Terraform..."
cd ../infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
echo "⚠️  Please edit terraform.tfvars with your configuration"
echo "✅ Terraform setup complete!"

echo ""
echo "=========================================="
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your local configuration"
echo "2. Edit infrastructure/terraform/terraform.tfvars with your AWS details"
echo "3. Run: docker-compose up -d (for local development)"
echo "4. Run: terraform init && terraform plan (for AWS deployment)"
echo ""
echo "Local URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:5000"
echo "  PostgreSQL: localhost:5432"
echo "  DynamoDB: http://localhost:8000"

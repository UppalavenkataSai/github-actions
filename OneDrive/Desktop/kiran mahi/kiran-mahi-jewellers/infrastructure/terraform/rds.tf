# RDS PostgreSQL Instance
resource "aws_db_instance" "main" {
  allocated_storage    = var.db_allocated_storage
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "15.3"
  instance_class       = var.db_instance_class
  db_name              = var.db_name
  username             = var.db_master_username
  password             = var.db_master_password
  parameter_group_name = aws_db_parameter_group.default.name
  skip_final_snapshot  = false
  final_snapshot_identifier = "${var.app_name}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  multi_az               = true
  publicly_accessible    = false
  storage_encrypted      = true
  enable_cloudwatch_logs_exports = ["postgresql"]

  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  tags = {
    Name = "${var.app_name}-db"
  }
}

# RDS Read Replica
resource "aws_db_instance" "replica" {
  identifier     = "${var.app_name}-db-replica"
  replicate_source_db = aws_db_instance.main.identifier
  instance_class       = var.db_instance_class
  
  skip_final_snapshot = true
  publicly_accessible = false

  tags = {
    Name = "${var.app_name}-db-replica"
  }
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.app_name}-db-subnet-group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = {
    Name = "${var.app_name}-db-subnet-group"
  }
}

# DB Parameter Group
resource "aws_db_parameter_group" "default" {
  family = "postgres15"
  name   = "${var.app_name}-db-params"

  parameter {
    name  = "max_connections"
    value = "100"
  }

  tags = {
    Name = "${var.app_name}-db-params"
  }
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name        = "${var.app_name}-rds-sg"
  description = "Security group for RDS database"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-rds-sg"
  }
}

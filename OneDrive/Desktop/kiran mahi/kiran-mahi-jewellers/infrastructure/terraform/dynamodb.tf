# DynamoDB Cache Table
resource "aws_dynamodb_table" "cache" {
  name           = "${var.app_name}-cache"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "key"

  attribute {
    name = "key"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = {
    Name = "${var.app_name}-cache"
  }
}

# DynamoDB Sessions Table
resource "aws_dynamodb_table" "sessions" {
  name           = "${var.app_name}-sessions"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "sessionId"

  attribute {
    name = "sessionId"
    type = "S"
  }

  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }

  tags = {
    Name = "${var.app_name}-sessions"
  }
}

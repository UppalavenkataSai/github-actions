const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// DynamoDB configuration for caching
const dynamodb = new AWS.DynamoDB({
  region: process.env.DYNAMODB_REGION || 'us-east-1'
});

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMODB_REGION || 'us-east-1'
});

module.exports = {
  dynamodb,
  documentClient,
  cacheTable: process.env.DYNAMODB_CACHE_TABLE || 'kiran-mahi-cache',
  sessionsTable: process.env.DYNAMODB_SESSIONS_TABLE || 'kiran-mahi-sessions'
};

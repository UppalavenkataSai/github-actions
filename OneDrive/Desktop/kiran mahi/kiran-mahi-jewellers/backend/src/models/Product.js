const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 255] }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('rings', 'necklaces', 'bracelets', 'earrings', 'sets', 'anklets'),
    allowNull: false,
  },
  metal: {
    type: DataTypes.ENUM('gold', 'silver', 'platinum', 'mixed'),
    allowNull: false,
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'Weight in grams'
  },
  purity: {
    type: DataTypes.STRING,
    comment: '18K, 22K, 24K, etc.'
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  imageUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  design: {
    type: DataTypes.TEXT,
  },
  artisan: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'products'
});

module.exports = Product;

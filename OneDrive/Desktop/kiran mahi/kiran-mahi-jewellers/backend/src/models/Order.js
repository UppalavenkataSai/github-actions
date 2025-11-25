const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'upi', 'bank_transfer', 'cod'),
  },
  shippingAddress: {
    type: DataTypes.JSONB,
  },
  billingAddress: {
    type: DataTypes.JSONB,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  trackingNumber: {
    type: DataTypes.STRING,
  },
  estimatedDelivery: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
  tableName: 'orders'
});

module.exports = Order;

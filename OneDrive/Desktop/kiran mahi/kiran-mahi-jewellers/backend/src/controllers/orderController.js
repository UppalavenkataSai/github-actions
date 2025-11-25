const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');

const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

exports.createOrder = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { shippingAddress, billingAddress, paymentMethod } = req.body;

    // Get cart items
    const cartItems = await Cart.findAll({
      where: { userId, isActive: true },
      include: [Product],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const itemTotal = item.priceAtAddTime * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        productName: item.Product.name,
        quantity: item.quantity,
        unitPrice: item.priceAtAddTime,
        totalPrice: itemTotal,
      });
    }

    // Create order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId,
      totalAmount,
      shippingAddress,
      billingAddress,
      paymentMethod,
    });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item,
      });
    }

    // Clear cart
    await Cart.update(
      { isActive: false },
      { where: { userId, isActive: true } }
    );

    res.status(201).json({
      message: 'Order created successfully',
      order,
      orderItems,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items' }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      orders: rows,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;

    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;

    const order = await Order.findByPk(orderId);
    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }

    await order.update({ status: 'cancelled' });

    res.json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

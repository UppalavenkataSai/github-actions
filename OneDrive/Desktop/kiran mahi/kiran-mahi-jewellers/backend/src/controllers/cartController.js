const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const cartItems = await Cart.findAll({
      where: { userId, isActive: true },
      include: [{ model: Product, as: 'product' }],
    });

    const total = cartItems.reduce((sum, item) => sum + (item.priceAtAddTime * item.quantity), 0);

    res.json({
      items: cartItems,
      total,
      itemCount: cartItems.length,
    });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity required' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if product already in cart
    let cartItem = await Cart.findOne({
      where: { userId, productId, isActive: true }
    });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await Cart.create({
        userId,
        productId,
        quantity,
        priceAtAddTime: product.price,
      });
    }

    res.status(201).json({
      message: 'Product added to cart',
      cartItem,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findByPk(cartItemId);
    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const product = await Product.findByPk(cartItem.productId);
    if (quantity > product.quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await cartItem.update({ quantity });

    res.json({
      message: 'Cart item updated',
      cartItem,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { cartItemId } = req.params;

    const cartItem = await Cart.findByPk(cartItemId);
    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.update({ isActive: false });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const { userId } = req.user;

    await Cart.update(
      { isActive: false },
      { where: { userId, isActive: true } }
    );

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

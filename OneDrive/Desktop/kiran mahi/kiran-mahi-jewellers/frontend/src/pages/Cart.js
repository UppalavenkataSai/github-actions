import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, ordersAPI } from '../services/api';
import useCartStore from '../context/cartStore';
import useAuthStore from '../context/authStore';
import toast from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, setItems, removeItem, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      setItems(response.data.items);
    } catch (error) {
      toast.error('Failed to load cart');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      removeItem(itemId);
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p>Your cart is empty</p>
        <button onClick={() => navigate('/products')} className="btn-continue-shopping">
          Continue Shopping
        </button>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + (item.priceAtAddTime * item.quantity), 0);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <h4>{item.Product?.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>₹{item.priceAtAddTime.toFixed(2)} each</p>
            </div>
            <div className="item-total">
              <p>₹{(item.priceAtAddTime * item.quantity).toFixed(2)}</p>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="btn-remove"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>₹0.00</span>
        </div>
        <div className="summary-total">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button onClick={handleCheckout} className="btn-checkout">
          Proceed to Checkout
        </button>
        <button onClick={() => navigate('/products')} className="btn-continue-shopping">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;

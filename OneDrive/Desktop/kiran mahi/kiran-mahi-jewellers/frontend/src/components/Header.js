import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import useAuthStore from '../context/authStore';
import useCartStore from '../context/cartStore';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/')}>
          <h1>Kiran Mahi Jewellers</h1>
        </div>

        <nav className="nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/">About</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/cart')} className="cart-btn">
                <FiShoppingCart />
                {items.length > 0 && <span className="cart-count">{items.length}</span>}
              </button>
              <button onClick={() => navigate('/profile')} className="profile-btn">
                <FiUser />
              </button>
              <button onClick={handleLogout} className="logout-btn">
                <FiLogOut />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/register')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

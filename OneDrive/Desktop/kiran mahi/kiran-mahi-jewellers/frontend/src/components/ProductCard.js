import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category">{product.category}</p>
        <p className="metal">{product.metal}</p>
        <p className="price">₹{product.price.toFixed(2)}</p>
        {product.weight && <p className="weight">Weight: {product.weight}g</p>}
        <div className="product-actions">
          <button 
            className="btn-add-to-cart"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
          <button className="btn-view-details">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

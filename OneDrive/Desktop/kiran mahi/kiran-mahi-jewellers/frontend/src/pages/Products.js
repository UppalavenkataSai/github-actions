import React, { useState, useEffect } from 'react';
import { productsAPI, cartAPI } from '../services/api';
import useCartStore from '../context/cartStore';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [metal, setMetal] = useState('');
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [category, metal]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll({ category, metal });
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await cartAPI.add({
        productId: product.id,
        quantity: 1,
      });
      addItem(response.data.cartItem);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  return (
    <div className="products-container">
      <div className="filters">
        <h3>Filters</h3>
        <div className="filter-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="rings">Rings</option>
            <option value="necklaces">Necklaces</option>
            <option value="bracelets">Bracelets</option>
            <option value="earrings">Earrings</option>
            <option value="sets">Sets</option>
            <option value="anklets">Anklets</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Metal</label>
          <select value={metal} onChange={(e) => setMetal(e.target.value)}>
            <option value="">All Metals</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Products;

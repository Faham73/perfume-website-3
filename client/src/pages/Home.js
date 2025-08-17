import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import ProductCard from '../components/ProductCard/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const featuredRes = await axios.get('/api/products?featured=true&limit=6');
        const bestsellerRes = await axios.get('/api/products?sort=popular&limit=6');
        setFeaturedProducts(featuredRes.data.products);
        setBestsellerProducts(bestsellerRes.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>ORKIDIES</h1>
          <p className="hero-tagline">Where Scent Meets Luxury</p>
          <p className="hero-description">
            Crafting unforgettable fragrances that define your identity and leave a lasting impression.
          </p>
          <Link to="/products" className="cta-button">
            Explore Collections
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Discover fragrances for every personality</p>
          </div>
          <div className="categories-grid">
            <div className="category-card men">
              <h3>Men's Fragrances</h3>
              <p>Bold scents for the modern man</p>
              <Link to="/products?category=Men" className="category-link">
                Shop Now
              </Link>
            </div>
            <div className="category-card women">
              <h3>Women's Fragrances</h3>
              <p>Elegant perfumes for every occasion</p>
              <Link to="/products?category=Women" className="category-link">
                Shop Now
              </Link>
            </div>
            <div className="category-card unisex">
              <h3>Unisex Fragrances</h3>
              <p>Versatile scents for all</p>
              <Link to="/products?category=Unisex" className="category-link">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Fragrances</h2>
            <p>Our most exquisite creations</p>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="view-all-container">
            <Link to="/products" className="view-all-button">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bestsellers-section">
        <div className="container">
          <div className="section-header">
            <h2>Customer Favorites</h2>
            <p>Most loved fragrances</p>
          </div>
          <div className="products-grid">
            {bestsellerProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
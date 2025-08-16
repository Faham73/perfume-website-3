import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Home.css';
import ProductCard from '../components/ProductCard/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const featuredContainerRef = useRef(null);
  const bestsellerContainerRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch featured products
        const featuredRes = await axios.get('/api/products?featured=true&limit=3');
        // Fetch bestsellers
        const bestsellerRes = await axios.get('/api/products?sort=popular&limit=4');
        
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

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };


  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>ORKIDIES</h1>
          <p>Where Scent Meets Luxury</p>
          <p className="hero-subtext">Orkidies creates unforgettable scents that define your identity, boost confidence, and leave a lasting impression. Experience the art of fragrance with us.</p>
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
            <p>Find the perfect fragrance for your style</p>
          </div>
          <div className="categories-grid">
            <div className="category-card men">
              <h3>Men's Fragrances</h3>
              <p>Sophisticated scents for the modern gentleman</p>
              <Link to="/products?category=Men" className="category-link">
                Shop Men's
              </Link>
            </div>
            <div className="category-card women">
              <h3>Women's Fragrances</h3>
              <p>Elegant perfumes for the confident woman</p>
              <Link to="/products?category=Women" className="category-link">
                Shop Women's
              </Link>
            </div>
            <div className="category-card unisex">
              <h3>Unisex Fragrances</h3>
              <p>Versatile scents for everyone</p>
              <Link to="/products?category=Unisex" className="category-link">
                Shop Unisex
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked luxury fragrances for the discerning customer</p>
          </div>
          <div className="products-scroll-wrapper">
            <button 
              className="scroll-button left" 
              onClick={() => scrollLeft(featuredContainerRef)}
            >
              <FaChevronLeft />
            </button>
            <div 
              className="products-scroll-container" 
              ref={featuredContainerRef}
            >
              {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="no-products">No featured products available</div>
              )}
            </div>
            <button 
              className="scroll-button right" 
              onClick={() => scrollRight(featuredContainerRef)}
            >
              <FaChevronRight />
            </button>
          </div>
          <div className="text-center">
            <Link to="/products" className="view-all-btn">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="bestsellers-section">
        <div className="container">
          <div className="section-header">
            <h2>Bestsellers</h2>
            <p>Our most popular fragrances loved by customers worldwide</p>
          </div>
          <div className="products-scroll-wrapper">
            <button 
              className="scroll-button left" 
              onClick={() => scrollLeft(bestsellerContainerRef)}
            >
              <FaChevronLeft />
            </button>
            <div 
              className="products-scroll-container" 
              ref={bestsellerContainerRef}
            >
              {bestsellerProducts.length > 0 ? (
                bestsellerProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="no-products">No bestsellers available</div>
              )}
            </div>
            <button 
              className="scroll-button right" 
              onClick={() => scrollRight(bestsellerContainerRef)}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
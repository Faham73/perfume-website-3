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
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const featuredIntervalRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch featured products
        const featuredRes = await axios.get('/api/products?featured=true&limit=6');
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

  useEffect(() => {
    if (featuredProducts.length > 3) {
      featuredIntervalRef.current = setInterval(() => {
        setCurrentFeaturedIndex(prev =>
          (prev + 1) % Math.ceil(featuredProducts.length / 3)
        );
      }, 3000); // Scrolls every 3 seconds
    }

    return () => {
      if (featuredIntervalRef.current) {
        clearInterval(featuredIntervalRef.current);
      }
    };
  }, [featuredProducts]);

  const scrollLeft = (ref) => {
    console.log('Scroll container:', ref.current); // Debug
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    console.log('Scroll container:', ref.current); // Debug
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleFeaturedHover = () => {
    clearInterval(featuredIntervalRef.current);
  };

  const handleFeaturedLeave = () => {
    featuredIntervalRef.current = setInterval(() => {
      setCurrentFeaturedIndex(prev =>
        (prev + 1) % Math.ceil(featuredProducts.length / 3)
      );
    }, 3000);
  };

  useEffect(() => {
    console.log(`Current index: ${currentFeaturedIndex}`);
    console.log('Featured products count:', featuredProducts.length);
// You need at least 4 products for the effect to work (showing 3 at a time) // Add this line
  }, [currentFeaturedIndex]);

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

      {/* Featured Products Section - Auto-scrolling Carousel */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked luxury fragrances for the discerning customer</p>
          </div>
          <div
            className="featured-carousel-container"
            onMouseEnter={handleFeaturedHover}
            onMouseLeave={handleFeaturedLeave}
          >
            <div
              className="featured-carousel"
              style={{
                transform: `translateX(-${currentFeaturedIndex * 100}%)`
              }}
            >
              {featuredProducts.map(product => (
                <div className="featured-carousel-item" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link to="/products" className="view-all-btn">
            View All Products
          </Link>
        </div>
      </section >


      {/* Bestsellers Section */}
      < section className="bestsellers-section" >
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
      </section >
    </div >
  );
};

export default Home;
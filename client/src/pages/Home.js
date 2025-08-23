import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import ProductCard from '../components/ProductCard/ProductCard';
import newFregranceImage from '../components/Assets/images/fragrance-hero.jpg';
import heroVideo from "../components/Assets/video/MVI_0414.MP4"

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
        {/* Video Background */}
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>ORKIDIES</h1>
          <p className="hero-tagline">Where Scent Meets Luxury</p>
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

      {/* New Arrivals */}
      <section class="perfume-section">
        {/* Top Left */}
        <div class="perfume-top-left">
          <img src={newFregranceImage} alt="Chanel N°5" class="perfume-small-img-top" />
          <img src={newFregranceImage} alt="Gabrielle Chanel" class="perfume-large-img-top" />
        </div>

        {/* Top Right */}
        <div class="perfume-top-right">
          <p class="perfume-small-text">OUR ORIGINAL PERFUME</p>
          <h2 class="perfume-title">
            THE <br />
            NEW <br />
            FRAGRANCE
          </h2>
          <p class="perfume-desc">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button class="btn-black">SHOP NOW</button>
        </div>

        {/* Bottom Left */}
        <div class="perfume-bottom-left">
          <p class="perfume-small-text">EAU DE TOILETTE</p>
          <h2 class="perfume-title">
            INSTINCTIVE <br />
            AND <br />
            ELECTRIC
          </h2>
          <p class="perfume-desc">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button class="btn-black">DISCOVER</button>
        </div>

        {/* Bottom Right */}
        <div class="perfume-bottom-right">
          <img src={newFregranceImage} alt="Paris Venise Chanel" class="perfume-large-img-bottom" />
          <img src={newFregranceImage} alt="Chanel N°5 Pure" class="perfume-small-img-bottom" />
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
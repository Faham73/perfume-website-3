import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';
import { FaShoppingCart, FaHeart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../Assets/images/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const hamburgerBtnRef = useRef(null);
  const cartMenuRef = useRef(null);
  const cartIconRef = useRef(null);

  // Scroll effect to toggle navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close navbar toggle menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerBtnRef.current &&
        !hamburgerBtnRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
      if (
        isCartMenuOpen &&
        cartMenuRef.current &&
        !cartMenuRef.current.contains(event.target) &&
        cartIconRef.current &&
        !cartIconRef.current.contains(event.target)
      ) {
        setIsCartMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isCartMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isCartMenuOpen) setIsCartMenuOpen(false);
  };

  const toggleCartMenu = () => {
    setIsCartMenuOpen(!isCartMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsCartMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      setIsCartMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left Group: Hamburger, Home, Products */}
        <div className="navbar-left-group">
          <button
            onClick={toggleMenu}
            ref={hamburgerBtnRef}
            className="mobile-menu-button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
        </div>

        {/* Center Logo */}
        <div className="navbar-brand-container">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Orkidies Logo" className="navbar-logo" />
          </Link>
        </div>

        {/* Right Group: Search, Wishlist, Cart */}
        <div className="navbar-right-group">
          {/* Search Icon Button */}
          <button onClick={toggleSearch} className="icon-button" aria-label="Toggle search">
            <FaSearch />
          </button>

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="icon-button" aria-label="Wishlist">
            <FaHeart />
          </Link>

          {/* Cart Icon with Menu Toggle */}
          {isAuthenticated && (
            <div className="cart-container">
              <button
                onClick={toggleCartMenu}
                ref={cartIconRef}
                className="cart-link"
                aria-label="Toggle cart menu"
              >
                <FaShoppingCart />
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </button>
              {isCartMenuOpen && (
                <div ref={cartMenuRef} className="cart-menu">
                  <button
                    className="cart-menu-btn"
                    onClick={() => {
                      setIsCartMenuOpen(false);
                      navigate('/cart');
                    }}
                  >
                    View Cart
                  </button>
                  <button
                    className="cart-menu-proceed-btn"
                    onClick={() => {
                      setIsCartMenuOpen(false);
                      navigate('/checkout');
                    }}
                  >
                    Proceed to Pay
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="mobile-search-container">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <input
                type="text"
                placeholder="Search perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
                autoFocus
              />
              <button type="submit" className="mobile-search-submit">
                <FaSearch />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu" ref={menuRef}>
            <div className="mobile-menu-content">
              <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/products" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link to="/about" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>About Us</Link>
              <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>

              <div className="mobile-auth-section">
                {isAuthenticated ? (
                  <>
                    <div className="mobile-user-info">
                      <span className="mobile-user-name">Hello, {user?.name}</span>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="mobile-admin-link" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                      )}
                    </div>
                    {user?.role !== 'admin' && (
                      <>
                        <Link to="/profile" className="mobile-auth-link" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                        <Link to="/cart" className="mobile-auth-link" onClick={() => setIsMenuOpen(false)}>My Cart {itemCount > 0 && `(${itemCount})`}</Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="mobile-auth-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="mobile-auth-link" onClick={() => setIsMenuOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
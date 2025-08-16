import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>

        {/* Left - Brand */}
        <div style={styles.brandContainer}>
          <Link to="/" style={styles.brand}>
            Perfume
          </Link>
        </div>

        {/* Center - Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search perfumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            <FaSearch />
          </button>
        </form>

        {/* Right - Links */}
        <div style={styles.links}>
          {!user?.role === 'admin' && (
            <Link to="/products" style={styles.link}>Shop</Link>
          )}

          {isAuthenticated && user?.role !== 'admin' && (
            <Link to="/cart" style={styles.cartLink}>
              <FaShoppingCart />
              {itemCount > 0 && <span style={styles.cartBadge}>{itemCount}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            <div style={styles.userMenu}>
              <span style={styles.userName}>Hello, {user?.name}</span>

              {user?.role === 'admin' ? (
                <>
                  <Link to="/admin" style={styles.adminLink}>Admin</Link>
                  <Link to="/admin/profile" style={styles.adminLink}>Admin Profile</Link>
                  <Link to="/admin/all-orders" style={styles.adminLink}>All Orders</Link>
                </>
              ) : (
                <>
                  <Link to="/profile" style={styles.link}>Profile</Link>
                  <Link to="/orders" style={styles.link}>Orders</Link>
                </>
              )}

              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <div style={styles.authLinks}>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={{ ...styles.link, marginLeft: '1rem' }}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'linear-gradient(90deg, rgba(0,120,180,0.8), rgba(0,100,160,0.8))',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '1.2rem 2.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 8px 32px rgba(0,80,100,0.25)',
    borderBottom: '2px solid rgba(0,240,255,0.6)',
    height: '80px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
  },
  brandContainer: {
    flexShrink: 0,
  },
  brand: {
    textDecoration: 'none',
    color: '#000000ff',
    fontWeight: '900',
    fontSize: '1.5rem',
    letterSpacing: '0.5px',
  },
  searchForm: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  },
  searchInput: {
    flex: 1,
    padding: '0.6rem 1rem',
    border: '1px solid rgba(36, 219, 185, 0.19)',
    backgroundColor: 'rgba(18, 1, 1, 0.25)',
    color: '#004d502c',
    borderRadius: '28px 0 0 28px',
    fontSize: '1rem',
    outline: 'none',
  },
  searchButton: {
    padding: '0.6rem 1rem',
    border: 'none',
    background: 'linear-gradient(135deg, #00eeffdd, #20c5af6f)',
    color: 'white',
    fontWeight: '600',
    borderRadius: '0 28px 28px 0',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    textDecoration: 'none',
    color: '#011a1bff',
    fontWeight: '700',
    transition: 'color 0.3s ease',
  },
  cartLink: {
    position: 'relative',
    textDecoration: 'none',
    color: '#008689',
    fontSize: '1.25rem',
    transition: 'opacity 0.25s ease',
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#6bf3ffff',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: '#008689',
    fontWeight: '500',
  },
  adminLink: {
    textDecoration: 'none',
    color: '#008689',
    fontWeight: '600',
  },
  logoutBtn: {
    background: 'linear-gradient(135deg, #20c5b0, #008689)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  authLinks: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default Navbar;

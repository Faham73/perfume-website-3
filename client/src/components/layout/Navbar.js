import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { FaShoppingCart, FaUser, FaSearch, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductsHovered, setIsProductsHovered] = useState(false);
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

        {/* Center - Navigation */}
        <div style={styles.navLinks}>
          {/* Products Dropdown */}
          <div 
            style={styles.dropdownContainer}
            onMouseEnter={() => setIsProductsHovered(true)}
            onMouseLeave={() => setIsProductsHovered(false)}
          >
            <Link to="/products" style={styles.navLink}>
              Products <FaChevronDown style={{ fontSize: '0.8rem', marginLeft: '4px' }} />
            </Link>
            
            {isProductsHovered && (
              <div style={styles.dropdownMenu}>
                <Link 
                  to="/products?category=combo-packs" 
                  style={styles.dropdownItem}
                  onClick={() => setIsProductsHovered(false)}
                >
                  Combo Packs
                </Link>
                <Link 
                  to="/products?category=men" 
                  style={styles.dropdownItem}
                  onClick={() => setIsProductsHovered(false)}
                >
                  For Men
                </Link>
                <Link 
                  to="/products?category=women" 
                  style={styles.dropdownItem}
                  onClick={() => setIsProductsHovered(false)}
                >
                  For Women
                </Link>
                <Link 
                  to="/products?category=unisex" 
                  style={styles.dropdownItem}
                  onClick={() => setIsProductsHovered(false)}
                >
                  Unisex
                </Link>
              </div>
            )}
          </div>

          {/* Other navigation links can be added here */}
          <Link to="/about" style={styles.navLink}>About Us</Link>
          <Link to="/contact" style={styles.navLink}>Contact</Link>
        </div>

        {/* Right - Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search perfumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            <FaSearch style={{ color: '#333' }} />
          </button>
        </form>

        {/* Right - Links */}
        <div style={styles.links}>
          {isAuthenticated && user?.role !== 'admin' && (
            <Link to="/cart" style={styles.cartLink}>
              <FaShoppingCart style={{ color: '#D4AF37' }} />
              {itemCount > 0 && <span style={styles.cartBadge}>{itemCount}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            <div style={styles.userMenu}>
              <span style={styles.userName}>Hello, {user?.name}</span>

              {user?.role === 'admin' ? (
                <>
                  <Link to="/admin" style={styles.adminLink}>Admin</Link>
                </>
              ) : (
                <Link to="/profile" style={styles.link}>Profile</Link>
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
    backgroundColor: '#ffffff',
    padding: '1.2rem 2.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderBottom: '1px solid #eaeaea',
    height: '80px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  brandContainer: {
    flexShrink: 0,
  },
  brand: {
    textDecoration: 'none',
    color: '#000000',
    fontWeight: '900',
    fontSize: '1.5rem',
    letterSpacing: '0.5px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    marginRight: 'auto',
    marginLeft: '3rem',
  },
  navLink: {
    textDecoration: 'none',
    color: '#000000',
    fontWeight: '600',
    transition: 'color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 0',
    position: 'relative',
    '&:hover': {
      color: '#D4AF37',
    },
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '0.5rem 0',
    minWidth: '180px',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownItem: {
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8f8f8',
      color: '#D4AF37',
    },
  },
  searchForm: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    maxWidth: '400px',
    margin: '0 2rem',
  },
  searchInput: {
    flex: 1,
    padding: '0.6rem 1rem',
    border: '1px solid #ddd',
    backgroundColor: '#f8f8f8',
    color: '#333',
    borderRadius: '28px 0 0 28px',
    fontSize: '1rem',
    outline: 'none',
  },
  searchButton: {
    padding: '0.6rem 1rem',
    border: 'none',
    backgroundColor: '#f8f8f8',
    color: '#333',
    fontWeight: '600',
    borderRadius: '0 28px 28px 0',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    borderLeft: 'none',
    border: '1px solid #ddd',
    borderLeft: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    textDecoration: 'none',
    color: '#000000',
    fontWeight: '600',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#D4AF37',
    },
  },
  cartLink: {
    position: 'relative',
    textDecoration: 'none',
    fontSize: '1.25rem',
    transition: 'opacity 0.25s ease',
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#D4AF37',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: '#333',
    fontWeight: '500',
  },
  adminLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.3s ease',
    '&:hover': {
      backgroundColor: '#D4AF37',
    },
  },
  authLinks: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default Navbar;
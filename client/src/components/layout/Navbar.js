import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { FaShoppingCart, FaUser, FaSearch, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  // Handle scroll effect
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

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
      setIsSearchOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <nav style={{ ...styles.navbar, ...(isScrolled && styles.navbarScrolled) }}>
      <div style={styles.container}>
        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} style={styles.mobileMenuButton}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Brand - Centered on mobile */}
        <div style={styles.brandContainer}>
          <Link to="/" style={styles.brand}>
            Orkideis
          </Link>
        </div>

        {/* Desktop Navigation */}
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

          <Link to="/about" style={styles.navLink}>About Us</Link>
          <Link to="/contact" style={styles.navLink}>Contact</Link>
        </div>

        {/* Desktop Search */}
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

        {/* Desktop Links */}
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

        {/* Mobile Search Button */}
        <button onClick={toggleSearch} style={styles.mobileSearchButton}>
          <FaSearch />
        </button>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div style={styles.mobileSearchContainer}>
          <form onSubmit={handleSearch} style={styles.mobileSearchForm}>
            <input
              type="text"
              placeholder="Search perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.mobileSearchInput}
              autoFocus
            />
            <button type="submit" style={styles.mobileSearchSubmit}>
              <FaSearch />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={styles.mobileMenu}>
          <div style={styles.mobileMenuContent}>
            <div style={styles.mobileNavLinks}>
              <div style={styles.mobileDropdownContainer}>
                <Link 
                  to="/products" 
                  style={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <div style={styles.mobileDropdownItems}>
                  <Link 
                    to="/products?category=combo-packs" 
                    style={styles.mobileDropdownItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Combo Packs
                  </Link>
                  <Link 
                    to="/products?category=men" 
                    style={styles.mobileDropdownItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    For Men
                  </Link>
                  <Link 
                    to="/products?category=women" 
                    style={styles.mobileDropdownItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    For Women
                  </Link>
                  <Link 
                    to="/products?category=unisex" 
                    style={styles.mobileDropdownItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Unisex
                  </Link>
                </div>
              </div>

              <Link 
                to="/about" 
                style={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                style={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            <div style={styles.mobileAuthSection}>
              {isAuthenticated ? (
                <>
                  <div style={styles.mobileUserInfo}>
                    <span style={styles.mobileUserName}>Hello, {user?.name}</span>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        style={styles.mobileAdminLink}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </div>
                  
                  {user?.role !== 'admin' && (
                    <>
                      <Link 
                        to="/profile" 
                        style={styles.mobileAuthLink}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/cart" 
                        style={styles.mobileAuthLink}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Cart {itemCount > 0 && `(${itemCount})`}
                      </Link>
                    </>
                  )}

                  <button 
                    onClick={handleLogout} 
                    style={styles.mobileLogoutBtn}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    style={styles.mobileAuthLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    style={styles.mobileAuthLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
    padding: '1.2rem 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    height: '80px',
    transition: 'all 0.3s ease',
  },
  navbarScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
  },
  brandContainer: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    '@media (min-width: 992px)': {
      position: 'static',
      transform: 'none',
      flexShrink: 0,
    },
  },
  brand: {
    textDecoration: 'none',
    color: '#000000',
    fontWeight: '700',
    fontSize: '1.8rem',
    letterSpacing: '1px',
    fontFamily: '"Playfair Display", serif',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#D4AF37',
    },
  },
  navLinks: {
    display: 'none',
    alignItems: 'center',
    gap: '2rem',
    marginRight: 'auto',
    marginLeft: '3rem',
    '@media (min-width: 992px)': {
      display: 'flex',
    },
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 0',
    position: 'relative',
    fontSize: '1.1rem',
    letterSpacing: '0.5px',
    '&:hover': {
      color: '#D4AF37',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '0',
      height: '2px',
      backgroundColor: '#D4AF37',
      transition: 'width 0.3s ease',
    },
    '&:hover::after': {
      width: '100%',
    },
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '0.5rem 0',
    minWidth: '200px',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(0,0,0,0.05)',
    opacity: '0',
    transform: 'translateY(10px)',
    animation: 'fadeIn 0.3s ease forwards',
  },
  dropdownItem: {
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    color: '#555',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    '&:hover': {
      backgroundColor: 'rgba(212, 175, 55, 0.1)',
      color: '#D4AF37',
    },
  },
  searchForm: {
    display: 'none',
    alignItems: 'center',
    maxWidth: '400px',
    margin: '0 2rem',
    flex: '1',
    '@media (min-width: 992px)': {
      display: 'flex',
    },
  },
  searchInput: {
    flex: '1',
    padding: '0.7rem 1.2rem',
    border: '1px solid #eee',
    backgroundColor: '#f9f9f9',
    color: '#333',
    borderRadius: '30px 0 0 30px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    '&:focus': {
      borderColor: '#D4AF37',
      backgroundColor: '#fff',
    },
  },
  searchButton: {
    padding: '0.7rem 1.2rem',
    border: 'none',
    backgroundColor: '#f9f9f9',
    color: '#333',
    fontWeight: '600',
    borderRadius: '0 30px 30px 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #eee',
    borderLeft: 'none',
    '&:hover': {
      backgroundColor: '#D4AF37',
      color: '#fff',
    },
  },
  links: {
    display: 'none',
    alignItems: 'center',
    gap: '1.5rem',
    '@media (min-width: 992px)': {
      display: 'flex',
    },
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    fontSize: '1.1rem',
    '&:hover': {
      color: '#D4AF37',
    },
  },
  cartLink: {
    position: 'relative',
    textDecoration: 'none',
    fontSize: '1.3rem',
    transition: 'all 0.3s ease',
    color: '#333',
    '&:hover': {
      color: '#D4AF37',
    },
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
    fontSize: '0.7rem',
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
    fontSize: '0.9rem',
  },
  adminLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#D4AF37',
    },
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#333',
    border: '1px solid #ddd',
    padding: '0.5rem 1rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    '&:hover': {
      backgroundColor: '#D4AF37',
      color: '#fff',
      borderColor: '#D4AF37',
    },
  },
  authLinks: {
    display: 'flex',
    alignItems: 'center',
  },
  mobileMenuButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#333',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    zIndex: 1100,
    '@media (min-width: 992px)': {
      display: 'none',
    },
  },
  mobileSearchButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#333',
    fontSize: '1.3rem',
    cursor: 'pointer',
    padding: '0.5rem',
    '@media (min-width: 992px)': {
      display: 'none',
    },
  },
  mobileSearchContainer: {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    backgroundColor: '#fff',
    padding: '1rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    zIndex: 100,
    '@media (min-width: 992px)': {
      display: 'none',
    },
  },
  mobileSearchForm: {
    display: 'flex',
    width: '100%',
  },
  mobileSearchInput: {
    flex: '1',
    padding: '0.8rem 1rem',
    border: '1px solid #eee',
    borderRadius: '30px 0 0 30px',
    fontSize: '1rem',
    outline: 'none',
  },
  mobileSearchSubmit: {
    padding: '0 1rem',
    border: '1px solid #eee',
    borderLeft: 'none',
    borderRadius: '0 30px 30px 0',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
  },
  mobileMenu: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: '80px',
  },
  mobileMenuContent: {
    backgroundColor: '#fff',
    width: '320px',
    height: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1.5rem',
  },
  mobileNavLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  mobileNavLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    fontSize: '1.1rem',
    padding: '0.75rem 0',
    display: 'block',
    borderBottom: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#D4AF37',
    },
  },
  mobileDropdownContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  mobileDropdownItems: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '1rem',
    marginTop: '0.5rem',
  },
  mobileDropdownItem: {
    textDecoration: 'none',
    color: '#666',
    fontWeight: '400',
    fontSize: '0.95rem',
    padding: '0.5rem 0',
    display: 'block',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#D4AF37',
    },
  },
  mobileAuthSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: 'auto',
    paddingTop: '2rem',
    borderTop: '1px solid #f0f0f0',
  },
  mobileUserInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  mobileUserName: {
    color: '#333',
    fontWeight: '500',
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  mobileAdminLink: {
    textDecoration: 'none',
    color: '#D4AF37',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  mobileAuthLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    fontSize: '1rem',
    padding: '0.75rem 0',
    display: 'block',
    borderBottom: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#D4AF37',
    },
  },
  mobileLogoutBtn: {
    backgroundColor: 'transparent',
    color: '#333',
    border: '1px solid #ddd',
    padding: '0.75rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1rem',
    marginTop: '1rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#D4AF37',
      color: '#fff',
      borderColor: '#D4AF37',
    },
  },
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Luxury Perfumes</h3>
            <p style={styles.footerText}>
              Discover the finest collection of luxury fragrances for every occasion. 
              Experience elegance and sophistication with our premium perfumes.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialLink}>
                <FaFacebook />
              </a>
              <a href="#" style={styles.socialLink}>
                <FaTwitter />
              </a>
              <a href="#" style={styles.socialLink}>
                <FaInstagram />
              </a>
              <a href="#" style={styles.socialLink}>
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Quick Links</h4>
            <ul style={styles.footerList}>
              <li><Link to="/" style={styles.footerLink}>Home</Link></li>
              <li><Link to="/products" style={styles.footerLink}>Products</Link></li>
              <li><Link to="/about" style={styles.footerLink}>About Us</Link></li>
              <li><Link to="/contact" style={styles.footerLink}>Contact</Link></li>
            </ul>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Categories</h4>
            <ul style={styles.footerList}>
              <li><Link to="/products?category=Men" style={styles.footerLink}>Men's Fragrances</Link></li>
              <li><Link to="/products?category=Women" style={styles.footerLink}>Women's Fragrances</Link></li>
              <li><Link to="/products?category=Unisex" style={styles.footerLink}>Unisex Fragrances</Link></li>
              <li><Link to="/products?category=Limited Edition" style={styles.footerLink}>Limited Edition</Link></li>
            </ul>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Customer Service</h4>
            <ul style={styles.footerList}>
              <li><Link to="/help" style={styles.footerLink}>Help Center</Link></li>
              <li><Link to="/shipping" style={styles.footerLink}>Shipping Info</Link></li>
              <li><Link to="/returns" style={styles.footerLink}>Returns</Link></li>
              <li><Link to="/size-guide" style={styles.footerLink}>Size Guide</Link></li>
            </ul>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.copyright}>
            © 2024 Luxury Perfumes. All rights reserved.
          </p>
          <div style={styles.legalLinks}>
            <Link to="/privacy" style={styles.legalLink}>Privacy Policy</Link>
            <Link to="/terms" style={styles.legalLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: '60px 0 20px',
    marginTop: 'auto'
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  },
  footerSection: {
    marginBottom: '1rem'
  },
  footerTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#ecf0f1'
  },
  footerSubtitle: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    color: '#ecf0f1'
  },
  footerText: {
    lineHeight: '1.6',
    marginBottom: '1rem',
    color: '#bdc3c7'
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem'
  },
  socialLink: {
    color: '#ecf0f1',
    fontSize: '1.5rem',
    transition: 'color 0.3s ease'
  },
  footerList: {
    listStyle: 'none',
    padding: 0
  },
  footerLink: {
    color: '#bdc3c7',
    textDecoration: 'none',
    lineHeight: '2',
    transition: 'color 0.3s ease'
  },
  footerBottom: {
    borderTop: '1px solid #34495e',
    paddingTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  copyright: {
    color: '#95a5a6',
    margin: 0
  },
  legalLinks: {
    display: 'flex',
    gap: '2rem'
  },
  legalLink: {
    color: '#95a5a6',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  }
};

export default Footer;

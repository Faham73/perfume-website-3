import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCartClick = (e) => {
    e.preventDefault();
    onAddToCart?.(product);
  };
  // Function to limit description to 10 words
  const getShortDescription = (desc) => {
    const defaultText = "A luxurious fragrance with exquisite notes";
    const words = (desc || defaultText).split(' ');
    return words.length > 10
      ? words.slice(0, 10).join(' ') + '...'
      : desc || defaultText;
  };

  // Render star rating
  const renderStars = () => {
    const rating = product.ratings || 5;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star filled" />);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star half-filled" />);
    }

    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star" />);
    }

    return stars;
  };

  const buttonStyle = {
    backgroundColor: product.color || '#2c3e50', // Default color if none specified
    '--hover-color': product.color
      ? `${adjustBrightness(product.color, -20)}`
      : '#1a252f'
  };

  // Helper function to adjust color brightness
  function adjustBrightness(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color =>
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
  }



  return (
    <div className="product-card-container">
      <Link to={`/products/${product._id}`} className="product-card-link">
        <div className="product-image-container">
          <img
            src={product.images[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {getShortDescription(product.description)}
          </p>
          <div className="product-rating">
            {renderStars()}
            <span className="rating-count">({product.numOfReviews || 0})</span>
          </div>
          <div className="product-price">${product.price}</div>
        </div>
      </Link>
      <button className="add-to-cart-btn" onClick={handleAddToCartClick} style={buttonStyle} >
        <FaShoppingCart className="cart-icon" /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
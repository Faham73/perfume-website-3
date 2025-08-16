import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../utils/axios';
import { FaStar, FaShoppingCart, FaChevronLeft, FaChevronRight, FaUserCircle } from 'react-icons/fa';
import './Products.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleStarClick = (rating) => {
    setReviewForm({ ...reviewForm, rating });
  };

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setError('');
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      // Refresh product to show new review
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="no-products">
          <h3>Product not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image-container">
              <img
                src={product.images[selectedImageIndex]?.url || product.images[selectedImageIndex] || '/placeholder.jpg'}
                alt={product.name}
                className="main-image"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-container">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url || img}
                    alt={`thumb-${idx}`}
                    className={`thumbnail ${selectedImageIndex === idx ? 'active' : ''}`}
                    onClick={() => handleImageSelect(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-detail">
            <h1 className="product-title">{product.name}</h1>
            <div className="brand-category">
              <span className="brand">{product.brand}</span>
              <span className="separator">•</span>
              <span className="category">{product.category}</span>
            </div>
            <div className="price-section">
              {product.oldPrice && product.oldPrice > product.price ? (
                <>
                  <span className="old-price">${product.oldPrice}</span>
                  <span className="current-price">${product.price}</span>
                  <span className="discount">
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                </>
              ) : (
                <span className="current-price">${product.price}</span>
              )}
            </div>
            <div className="rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < (product.ratings || 0) ? 'star active' : 'star'} />
                ))}
              </div>
              <span className="rating-text">{product.ratings?.toFixed(1) || 0} ({product.numOfReviews || 0} reviews)</span>
            </div>
            <div className="volume-stock">
              <span className="volume">Volume: {product.volume}</span>
              <span className="separator">•</span>
              <span className="stock">Stock: {product.stock}</span>
            </div>
            <p className="description">{product.description}</p>
            <div className="add-to-cart-section">
              <div className="quantity-section">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                  className="quantity-input"
                />
              </div>
              <div className="button-group">
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart /> {isInCart(product._id) ? `In Cart (${getItemQuantity(product._id)})` : 'Add to Cart'}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews-list">
              {product.reviews.map((review, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header">
                    <FaUserCircle className="review-avatar" />
                    <div className="review-info">
                      <span className="reviewer-name">{review.name || review.user?.name || 'Anonymous'}</span>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? 'star active' : 'star inactive'} />
                        ))}
                      </div>
                      <span className="review-date">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                  <div className="review-comment">{review.comment}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          )}

          {/* Review Form */}
          <div className="review-form-section">
            <h3>Write a Review</h3>
            {error && <div className="review-error">{error}</div>}
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating:</label>
                <div className="star-rating-input">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`star-input ${i < reviewForm.rating ? 'active' : ''}`}
                      onClick={() => handleStarClick(i + 1)}
                    />
                  ))}
                  <span className="rating-text">{reviewForm.rating} Star{reviewForm.rating > 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Comment:</label>
                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  className="form-control"
                  rows={3}
                  required
                  placeholder="Share your experience..."
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

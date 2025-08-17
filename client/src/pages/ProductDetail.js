import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../utils/axios';
import { FaStar, FaShoppingCart, FaChevronLeft, FaChevronRight, FaUserCircle, FaHeart, FaShare, FaExpand } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import ReactImageMagnify from 'react-image-magnify';
import './ProductDetail.css';

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
  const [wishlist, setWishlist] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

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
    // Show a subtle notification
    const event = new CustomEvent('notify', { detail: { message: `${product.name} added to cart`, type: 'success' } });
    window.dispatchEvent(event);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
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
      // Show success notification
      const event = new CustomEvent('notify', { detail: { message: 'Review submitted successfully!', type: 'success' } });
      window.dispatchEvent(event);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
      // Show error notification
      const event = new CustomEvent('notify', { detail: { message: error, type: 'error' } });
      window.dispatchEvent(event);
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleWishlist = () => {
    setWishlist(!wishlist);
    const message = wishlist ? 'Removed from wishlist' : 'Added to wishlist';
    const event = new CustomEvent('notify', { detail: { message, type: 'success' } });
    window.dispatchEvent(event);
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this amazing product: ${product.name}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      const event = new CustomEvent('notify', { detail: { message: 'Link copied to clipboard!', type: 'success' } });
      window.dispatchEvent(event);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="premium-spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-text">Loading Luxury Details</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="premium-container">
        <div className="no-products">
          <div className="luxury-message">
            <h3>Product Not Found</h3>
            <p>We couldn't find the luxury item you're looking for.</p>
            <button className="btn-luxury" onClick={() => navigate('/')}>
              Explore Our Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-product-page">
      {/* Breadcrumb Navigation */}
      <div className="luxury-breadcrumb">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Shop</a></li>
              <li><a href={`/products?category=${product.category}`}>{product.category}</a></li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className="premium-product-grid">
          {/* Image Gallery */}
          <div className="luxury-gallery">
            <div className="main-image-container" onMouseEnter={() => setZoomActive(true)} onMouseLeave={() => setZoomActive(false)}>
              {zoomActive ? (
                <ReactImageMagnify {...{
                  smallImage: {
                    alt: product.name,
                    isFluidWidth: true,
                    src: product.images[selectedImageIndex]?.url || product.images[selectedImageIndex] || '/placeholder.jpg'
                  },
                  largeImage: {
                    src: product.images[selectedImageIndex]?.url || product.images[selectedImageIndex] || '/placeholder.jpg',
                    width: 1200,
                    height: 1800
                  },
                  enlargedImagePosition: 'over',
                  lensStyle: { backgroundColor: 'rgba(0,0,0,.1)' }
                }} />
              ) : (
                <img
                  src={product.images[selectedImageIndex]?.url || product.images[selectedImageIndex] || '/placeholder.jpg'}
                  alt={product.name}
                  className="main-image"
                  onClick={() => setShowImageModal(true)}
                />
              )}
              
              <button className="zoom-hint" onClick={() => setZoomActive(!zoomActive)}>
                <FaExpand /> {zoomActive ? 'Disable Zoom' : 'Hover to Zoom'}
              </button>
              
              <div className="image-nav">
                <button className="nav-btn prev" onClick={handlePrevImage}>
                  <IoIosArrowBack />
                </button>
                <button className="nav-btn next" onClick={handleNextImage}>
                  <IoIosArrowForward />
                </button>
              </div>
              
              <div className="image-badge-group">
                {product.stock <= 10 && product.stock > 0 && (
                  <span className="badge low-stock">Only {product.stock} left</span>
                )}
                {product.stock === 0 && (
                  <span className="badge out-of-stock">Out of Stock</span>
                )}
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="badge discount-badge">
                    Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-scroller">
                <div className="thumbnail-track">
                  {product.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`thumbnail-wrapper ${selectedImageIndex === idx ? 'active' : ''}`}
                      onClick={() => handleImageSelect(idx)}
                    >
                      <img
                        src={img.url || img}
                        alt={`thumb-${idx}`}
                        className="thumbnail"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="luxury-product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="action-buttons">
                <button 
                  className={`wishlist-btn ${wishlist ? 'active' : ''}`}
                  onClick={toggleWishlist}
                  aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <FaHeart />
                </button>
                <button 
                  className="share-btn"
                  onClick={shareProduct}
                  aria-label="Share this product"
                >
                  <FaShare />
                </button>
              </div>
            </div>
            
            <div className="brand-exclusivity">
              <span className="brand">{product.brand}</span>
              {product.exclusive && <span className="exclusive-label">Exclusive</span>}
            </div>
            
            <div className="price-section">
              {product.oldPrice && product.oldPrice > product.price ? (
                <>
                  <span className="old-price">${product.oldPrice.toFixed(2)}</span>
                  <span className="current-price">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="current-price">${product.price.toFixed(2)}</span>
              )}
              <div className="price-note">Includes VAT where applicable</div>
            </div>
            
            <div className="rating-availability">
              <div className="rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < (product.ratings || 0) ? 'star active' : 'star'} />
                  ))}
                </div>
                <a href="#reviews" className="rating-text">
                  {product.ratings?.toFixed(1) || 0} ({product.numOfReviews || 0} reviews)
                </a>
              </div>
              <div className={`availability ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
            
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">SKU:</span>
                <span className="meta-value">{product.sku || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.category}</span>
              </div>
              {product.volume && (
                <div className="meta-item">
                  <span className="meta-label">Size:</span>
                  <span className="meta-value">{product.volume}</span>
                </div>
              )}
            </div>
            
            <div className="product-description">
              <h3>Product Details</h3>
              <p>{product.description}</p>
              {product.features && (
                <ul className="feature-list">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    className="qty-btn minus" 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                    className="quantity-input"
                  />
                  <button 
                    className="qty-btn plus" 
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="action-buttons">
                <button
                  className={`btn-luxury add-to-cart ${isInCart(product._id) ? 'in-cart' : ''}`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart />
                  {isInCart(product._id) ? `Added (${getItemQuantity(product._id)})` : 'Add to Cart'}
                </button>
                <button
                  className="btn-luxury buy-now"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
              </div>
              
              {product.stock === 0 && (
                <div className="notify-me">
                  <p>This item is currently out of stock.</p>
                  <button className="btn-luxury outline">Notify Me When Available</button>
                </div>
              )}
            </div>
            
            <div className="delivery-options">
              <div className="delivery-option">
                <div className="delivery-icon">🚚</div>
                <div className="delivery-info">
                  <h4>Free Shipping</h4>
                  <p>On orders over $100. Delivery in 2-3 business days.</p>
                </div>
              </div>
              <div className="delivery-option">
                <div className="delivery-icon">🔄</div>
                <div className="delivery-info">
                  <h4>Easy Returns</h4>
                  <p>30-day return policy. No questions asked.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="luxury-tabs">
          <input type="radio" id="tab1" name="tabs" defaultChecked />
          <label htmlFor="tab1">Description</label>
          <div className="tab-content">
            <h3>Product Story</h3>
            <p>{product.fullDescription || product.description}</p>
            
            <h3>Materials & Care</h3>
            <p>{product.materials || 'Premium materials crafted for longevity and comfort.'}</p>
            
            <h3>Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Brand</span>
                <span className="spec-value">{product.brand}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Dimensions</span>
                <span className="spec-value">{product.dimensions || 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Weight</span>
                <span className="spec-value">{product.weight || 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Color</span>
                <span className="spec-value">{product.color || 'As pictured'}</span>
              </div>
            </div>
          </div>
          
          <input type="radio" id="tab2" name="tabs" />
          <label htmlFor="tab2">Reviews ({product.numOfReviews || 0})</label>
          <div className="tab-content" id="reviews">
            <div className="reviews-summary">
              <div className="overall-rating">
                <div className="average">{product.ratings?.toFixed(1) || '0.0'}</div>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(product.ratings || 0) ? 'star active' : 'star'} />
                  ))}
                </div>
                <div className="total">Based on {product.numOfReviews || 0} reviews</div>
              </div>
              
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = product.reviews?.filter(r => r.rating === stars).length || 0;
                  const percentage = product.numOfReviews ? (count / product.numOfReviews) * 100 : 0;
                  
                  return (
                    <div className="rating-bar" key={stars}>
                      <div className="stars">{stars} <FaStar className="star active" /></div>
                      <div className="bar-container">
                        <div 
                          className="bar" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="count">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {product.reviews && product.reviews.length > 0 ? (
              <div className="reviews-list">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">
                        {review.user?.avatar ? (
                          <img src={review.user.avatar} alt={review.name} />
                        ) : (
                          <FaUserCircle className="default-avatar" />
                        )}
                      </div>
                      <div className="review-info">
                        <div className="reviewer-name">{review.name || review.user?.name || 'Anonymous'}</div>
                        <div className="review-meta">
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < review.rating ? 'star active' : 'star inactive'} />
                            ))}
                          </div>
                          <span className="review-date">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            }) : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="review-content">
                      <h4 className="review-title">{review.title || 'Great Product'}</h4>
                      <p className="review-comment">{review.comment}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="review-images">
                          {review.images.map((img, i) => (
                            <img key={i} src={img} alt={`Review ${idx + 1}`} className="review-image" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews">
                <div className="empty-state">
                  <FaStar className="empty-icon" />
                  <h3>No Reviews Yet</h3>
                  <p>Be the first to share your thoughts about this product</p>
                </div>
              </div>
            )}

            {/* Review Form */}
            <div className="review-form-section">
              <h3>Write a Review</h3>
              {error && <div className="review-error">{error}</div>}
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Your Rating</label>
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
                  <label htmlFor="review-title">Review Title</label>
                  <input
                    type="text"
                    id="review-title"
                    name="title"
                    className="form-control"
                    placeholder="Summarize your experience"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="review-comment">Your Review</label>
                  <textarea
                    id="review-comment"
                    name="comment"
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    className="form-control"
                    rows={5}
                    required
                    placeholder="Share your experience with this product..."
                  />
                </div>
                
                <div className="form-group">
                  <label>Add Photos (Optional)</label>
                  <div className="image-upload">
                    <div className="upload-preview">
                      <div className="upload-placeholder">
                        <span>+</span>
                        <p>Add Photo</p>
                      </div>
                    </div>
                    <input type="file" id="review-images" multiple accept="image/*" style={{ display: 'none' }} />
                  </div>
                </div>
                
                <button className="btn-luxury" type="submit" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
          
          <input type="radio" id="tab3" name="tabs" />
          <label htmlFor="tab3">Shipping & Returns</label>
          <div className="tab-content">
            <h3>Shipping Information</h3>
            <div className="shipping-options">
              <div className="shipping-option">
                <h4>Standard Shipping</h4>
                <p>Free on orders over $100. Delivery in 3-5 business days.</p>
              </div>
              <div className="shipping-option">
                <h4>Express Shipping</h4>
                <p>$15. Delivery in 1-2 business days.</p>
              </div>
              <div className="shipping-option">
                <h4>International Shipping</h4>
                <p>Available to most countries. Rates calculated at checkout.</p>
              </div>
            </div>
            
            <h3>Returns & Exchanges</h3>
            <p>We offer a 30-day return policy for most items. Items must be in original condition with all tags attached. 
            Please contact our customer service team to initiate a return.</p>
            
            <h3>Additional Information</h3>
            <p>For any questions regarding shipping or returns, please contact our customer service team at 
            support@luxuryshop.com or call us at (555) 123-4567.</p>
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h2>You May Also Like</h2>
          <div className="products-carousel">
            {/* This would be populated with related products from an API */}
            <div className="carousel-item">
              <div className="related-product-card">
                <div className="product-image">
                  <img src="/placeholder-product.jpg" alt="Related Product" />
                  <button className="quick-view">Quick View</button>
                </div>
                <div className="product-info">
                  <h3>Luxury Companion Product</h3>
                  <div className="price">$199.00</div>
                </div>
              </div>
            </div>
            {/* More carousel items would go here */}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowImageModal(false)}>
              &times;
            </button>
            <img 
              src={product.images[selectedImageIndex]?.url || product.images[selectedImageIndex] || '/placeholder.jpg'}
              alt={product.name}
              className="modal-image"
            />
            <div className="modal-thumbnails">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url || img}
                  alt={`thumb-${idx}`}
                  className={`modal-thumbnail ${selectedImageIndex === idx ? 'active' : ''}`}
                  onClick={() => handleImageSelect(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
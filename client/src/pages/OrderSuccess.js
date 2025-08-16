import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaShieldAlt, FaTruck, FaCreditCard } from 'react-icons/fa';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order data from location state or localStorage
    const data = location.state?.orderData || JSON.parse(localStorage.getItem('lastOrder') || 'null');
    setOrderData(data);
    setLoading(false);
  }, [location]);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="success-card">
            <FaCheckCircle className="success-icon" />
            <h1>Order Placed Successfully!</h1>
            <p>Your order has been confirmed and is being processed.</p>
            <button onClick={handleContinueShopping} className="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-card">
          <FaCheckCircle className="success-icon" />
          <h1>Thank You for Your Order!</h1>
          <p className="success-message">
            Your order has been successfully placed and is being processed.
          </p>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-details">
              <div className="detail-row">
                <span>Order Total:</span>
                <span className="total-amount">${orderData.total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="detail-row">
                <span>Items:</span>
                <span>{orderData.items?.length || 0} item(s)</span>
              </div>
              <div className="detail-row">
                <span>Payment Method:</span>
                <span className="payment-method">
                  {orderData.payment?.method === 'bkash' && <FaCreditCard />}
                  {orderData.payment?.method === 'nagad' && <FaCreditCard />}
                  {orderData.payment?.method === 'rocket' && <FaCreditCard />}
                  {orderData.payment?.method === 'creditCard' && <FaCreditCard />}
                  {orderData.payment?.method?.toUpperCase() || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <div className="steps-grid">
              <div className="step">
                <FaEnvelope className="step-icon" />
                <h4>Email Confirmation</h4>
                <p>You'll receive an email confirmation with order details and tracking information.</p>
              </div>
              <div className="step">
                <FaTruck className="step-icon" />
                <h4>Order Processing</h4>
                <p>We'll process your order and prepare it for shipping within 1-2 business days.</p>
              </div>
              <div className="step">
                <FaShieldAlt className="step-icon" />
                <h4>Secure Delivery</h4>
                <p>Your order will be delivered securely to your specified address.</p>
              </div>
            </div>
          </div>

          {orderData.verification && (
            <div className="verification-notice">
              <h3>Complete Your Account Setup</h3>
              <p>
                Since you placed this order as a guest, we've created a temporary account for you. 
                Check your email for a verification link to set up your permanent password and access your order history.
              </p>
              <div className="verification-token">
                <strong>Verification Token (for testing):</strong>
                <code>{orderData.verification}</code>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button onClick={handleContinueShopping} className="btn btn-secondary">
              Continue Shopping
            </button>
            <button onClick={handleViewOrders} className="btn btn-primary">
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaCreditCard, FaMobile, FaWallet, FaShieldAlt, FaTruck, FaCheck, FaMoneyBillWave, FaBox } from 'react-icons/fa';
import { MdPayment, MdLocalShipping } from 'react-icons/md';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Bangladesh'
    }
  });
  
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [paymentDetails, setPaymentDetails] = useState({
    bkash: { number: '', transactionId: '' }
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDhaka, setIsDhaka] = useState(true);

  const shippingCost = isDhaka ? 70 : 130; // Dynamic shipping cost
  const tax = total * 0.05; // 5% tax
  const grandTotal = total + shippingCost + tax;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [items, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Check if address is in Dhaka to update shipping cost
    if (name === 'address.city') {
      setIsDhaka(value.toLowerCase().includes('dhaka'));
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [paymentMethod]: {
        ...prev[paymentMethod],
        [name]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.address.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.state.trim()) newErrors.state = 'State is required';
    if (!formData.address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    // Payment validation for bKash
    if (paymentMethod === 'bkash') {
      if (!paymentDetails.bkash.number.trim()) {
        newErrors.paymentNumber = 'bKash number is required';
      }
      if (!paymentDetails.bkash.transactionId.trim()) {
        newErrors.transactionId = 'Transaction ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send the order to backend (guest-friendly)
      const orderItems = items.map(i => ({ product: i._id, quantity: i.quantity, price: i.price }));
      const payload = {
        items: orderItems,
        shipping: formData,
        payment: { 
          method: paymentMethod, 
          details: paymentMethod === 'bkash' ? paymentDetails.bkash : null 
        },
        total: parseFloat(grandTotal.toFixed(2)),
        subtotal: total,
        shippingCost,
        tax: parseFloat(tax.toFixed(2)),
        guest: !isAuthenticated
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          ...(localStorage.getItem('token') ? { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          } : {}) 
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to place order');
      }
      
      const data = await res.json();
      clearCart();
      
      // Store order data for success page
      localStorage.setItem('lastOrder', JSON.stringify({
        ...data,
        order: data.order,
        verification: data.verification
      }));
      
      navigate('/order-success');
      
    } catch (error) {
      console.error('Order processing error:', error);
      setErrors({ submit: error.message || 'Failed to process order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Complete Your Purchase</h1>
          <p className="checkout-steps">
            <span className="step active"><FaCheck /> Cart</span>
            <span className="step active"><FaCheck /> Information</span>
            <span className="step active"><MdPayment /> Payment</span>
            <span className="step"><FaBox /> Confirmation</span>
          </p>
        </div>

        <div className="checkout-grid">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Shipping Information */}
              <div className="form-section">
                <h2><FaTruck /> Delivery Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="Your first name"
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Your last name"
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className={errors.street ? 'error' : ''}
                    placeholder="House #, Road #, Area"
                  />
                  {errors.street && <span className="error-message">{errors.street}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="e.g. Dhaka, Chittagong"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>State/Division *</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      className={errors.state ? 'error' : ''}
                      placeholder="e.g. Dhaka, Chittagong"
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      className={errors.zipCode ? 'error' : ''}
                      placeholder="e.g. 1206"
                    />
                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h2><MdPayment /> Payment Method</h2>
                <div className="payment-methods">
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="bkash"
                      name="paymentMethod"
                      value="bkash"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => handlePaymentMethodChange('bkash')}
                    />
                    <label htmlFor="bkash" className="payment-label">
                      <FaMoneyBillWave className="payment-icon bkash" />
                      <div className="payment-method-info">
                        <span>bKash</span>
                        <small>Instant payment via bKash</small>
                      </div>
                    </label>
                  </div>

                  <div className="payment-method">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                    />
                    <label htmlFor="cod" className="payment-label">
                      <MdLocalShipping className="payment-icon cod" />
                      <div className="payment-method-info">
                        <span>Cash on Delivery</span>
                        <small>Pay when you receive</small>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Details for bKash */}
                {paymentMethod === 'bkash' && (
                  <div className="payment-details">
                    <div className="form-row">
                      <div className="form-group">
                        <label>bKash Number *</label>
                        <input
                          type="tel"
                          name="number"
                          value={paymentDetails.bkash.number}
                          onChange={handlePaymentDetailsChange}
                          placeholder="01XXXXXXXXX"
                          className={errors.paymentNumber ? 'error' : ''}
                        />
                        {errors.paymentNumber && <span className="error-message">{errors.paymentNumber}</span>}
                      </div>
                      <div className="form-group">
                        <label>Transaction ID *</label>
                        <input
                          type="text"
                          name="transactionId"
                          value={paymentDetails.bkash.transactionId}
                          onChange={handlePaymentDetailsChange}
                          placeholder="e.g., TXN123456789"
                          className={errors.transactionId ? 'error' : ''}
                        />
                        {errors.transactionId && <span className="error-message">{errors.transactionId}</span>}
                      </div>
                    </div>
                    <div className="payment-instructions">
                      <h4>How to pay with bKash:</h4>
                      <ol>
                        <li>Go to your bKash Mobile Menu by dialing *247#</li>
                        <li>Choose "Payment"</li>
                        <li>Enter our Merchant bKash Number: <strong>017XXXXXXXX</strong></li>
                        <li>Enter amount: <strong>৳{grandTotal.toFixed(2)}</strong></li>
                        <li>Enter reference: <strong>Order#{Math.floor(Math.random() * 10000)}</strong></li>
                        <li>Enter the counter number: <strong>1</strong></li>
                        <li>Now enter your bKash PIN to confirm</li>
                        <li>Copy the Transaction ID (TrxID) and paste above</li>
                      </ol>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="payment-details">
                    <div className="cod-notice">
                      <div className="cod-icon">
                        <MdLocalShipping />
                      </div>
                      <div className="cod-text">
                        <h4>Cash on Delivery</h4>
                        <p>Pay with cash when your order is delivered. An additional ৳20 may be charged for cash handling.</p>
                        <p className="cod-warning">
                          <FaShieldAlt /> Please have exact change ready for the delivery person.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

                <button
                  type="submit"
                  className="btn btn-primary checkout-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : (
                    `Place Order - ৳${grandTotal.toFixed(2)}`
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="order-items">
                {items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image-container">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <span className="item-quantity">{item.quantity}</span>
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-price">৳{(item.price * item.quantity).toFixed(2)}</p>
                      {item.size && <p className="item-variant">Size: {item.size}</p>}
                      {item.color && <p className="item-variant">Color: {item.color}</p>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>৳{shippingCost.toFixed(2)} ({isDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                </div>
                <div className="total-row">
                  <span>Tax (5%):</span>
                  <span>৳{tax.toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>৳{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="security-badge">
                <FaShieldAlt className="security-icon" />
                <div className="security-text">
                  <span>Secure Checkout</span>
                  <small>All your data is securely encrypted</small>
                </div>
              </div>
              
              <div className="return-policy">
                <h4><FaBox /> Return Policy</h4>
                <p>Easy 7-day returns and exchanges. Damaged or defective items eligible for free returns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaCreditCard, FaMobile, FaWallet, FaShieldAlt, FaTruck, FaCheck, FaMoneyBillWave } from 'react-icons/fa';
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
    bkash: { number: '', transactionId: '' },
    creditCard: { number: '', expiry: '', cvv: '', name: '' },
    nagad: { number: '', transactionId: '' },
    rocket: { number: '', transactionId: '' }
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const shippingCost = 60; // 60 BDT shipping cost
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

    // Payment validation
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') {
      if (!paymentDetails[paymentMethod].number.trim()) {
        newErrors.paymentNumber = 'Mobile number is required';
      }
      if (!paymentDetails[paymentMethod].transactionId.trim()) {
        newErrors.transactionId = 'Transaction ID is required';
      }
    }

    if (paymentMethod === 'creditCard') {
      if (!paymentDetails.creditCard.number.trim()) newErrors.cardNumber = 'Card number is required';
      if (!paymentDetails.creditCard.expiry.trim()) newErrors.expiry = 'Expiry date is required';
      if (!paymentDetails.creditCard.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!paymentDetails.creditCard.name.trim()) newErrors.cardName = 'Cardholder name is required';
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
        payment: { method: paymentMethod, details: paymentDetails[paymentMethod] },
        total: parseFloat(grandTotal.toFixed(2)),
        subtotal: total,
        shippingCost,
        tax: parseFloat(tax.toFixed(2)),
        guest: !isAuthenticated
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}) },
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
      setErrors({ submit: 'Failed to process order. Please try again.' });
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
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>

        <div className="checkout-grid">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Shipping Information */}
              <div className="form-section">
                <h2><FaTruck /> Shipping Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
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
                      placeholder="+880 1XXX XXX XXX"
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
                <h2><FaCreditCard /> Payment Method</h2>
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
                       <span>bKash</span>
                     </label>
                  </div>

                  <div className="payment-method">
                    <input
                      type="radio"
                      id="nagad"
                      name="paymentMethod"
                      value="nagad"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => handlePaymentMethodChange('nagad')}
                    />
                    <label htmlFor="nagad" className="payment-label">
                      <FaWallet className="payment-icon nagad" />
                      <span>Nagad</span>
                    </label>
                  </div>

                  <div className="payment-method">
                    <input
                      type="radio"
                      id="rocket"
                      name="paymentMethod"
                      value="rocket"
                      checked={paymentMethod === 'rocket'}
                      onChange={() => handlePaymentMethodChange('rocket')}
                    />
                    <label htmlFor="rocket" className="payment-label">
                      <FaMobile className="payment-icon rocket" />
                      <span>Rocket</span>
                    </label>
                  </div>

                  <div className="payment-method">
                    <input
                      type="radio"
                      id="creditCard"
                      name="paymentMethod"
                      value="creditCard"
                      checked={paymentMethod === 'creditCard'}
                      onChange={() => handlePaymentMethodChange('creditCard')}
                    />
                    <label htmlFor="creditCard" className="payment-label">
                      <FaCreditCard className="payment-icon credit" />
                      <span>Credit/Debit Card</span>
                    </label>
                  </div>
                </div>

                {/* Payment Details */}
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
                          placeholder="+880 1XXX XXX XXX"
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
                      <p><strong>Instructions:</strong></p>
                      <ol>
                        <li>Send ৳{grandTotal} to +880 1XXX XXX XXX</li>
                        <li>Copy the Transaction ID</li>
                        <li>Paste it in the field above</li>
                      </ol>
                    </div>
                  </div>
                )}

                {paymentMethod === 'nagad' && (
                  <div className="payment-details">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nagad Number *</label>
                        <input
                          type="tel"
                          name="number"
                          value={paymentDetails.nagad.number}
                          onChange={handlePaymentDetailsChange}
                          placeholder="+880 1XXX XXX XXX"
                          className={errors.paymentNumber ? 'error' : ''}
                        />
                        {errors.paymentNumber && <span className="error-message">{errors.paymentNumber}</span>}
                      </div>
                      <div className="form-group">
                        <label>Transaction ID *</label>
                        <input
                          type="text"
                          name="transactionId"
                          value={paymentDetails.nagad.transactionId}
                          onChange={handlePaymentDetailsChange}
                          placeholder="e.g., TXN123456789"
                          className={errors.transactionId ? 'error' : ''}
                        />
                        {errors.transactionId && <span className="error-message">{errors.transactionId}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'rocket' && (
                  <div className="payment-details">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Rocket Number *</label>
                        <input
                          type="tel"
                          name="number"
                          value={paymentDetails.rocket.number}
                          onChange={handlePaymentDetailsChange}
                          placeholder="+880 1XXX XXX XXX"
                          className={errors.paymentNumber ? 'error' : ''}
                        />
                        {errors.paymentNumber && <span className="error-message">{errors.paymentNumber}</span>}
                      </div>
                      <div className="form-group">
                        <label>Transaction ID *</label>
                        <input
                          type="text"
                          name="transactionId"
                          value={paymentDetails.rocket.transactionId}
                          onChange={handlePaymentDetailsChange}
                          placeholder="e.g., TXN123456789"
                          className={errors.transactionId ? 'error' : ''}
                        />
                        {errors.transactionId && <span className="error-message">{errors.transactionId}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'creditCard' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>Cardholder Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={paymentDetails.creditCard.name}
                        onChange={handlePaymentDetailsChange}
                        placeholder="Name on card"
                        className={errors.cardName ? 'error' : ''}
                      />
                      {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                    </div>
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        name="number"
                        value={paymentDetails.creditCard.number}
                        onChange={handlePaymentDetailsChange}
                        placeholder="1234 5678 9012 3456"
                        className={errors.cardNumber ? 'error' : ''}
                      />
                      {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="expiry"
                          value={paymentDetails.creditCard.expiry}
                          onChange={handlePaymentDetailsChange}
                          placeholder="MM/YY"
                          className={errors.expiry ? 'error' : ''}
                        />
                        {errors.expiry && <span className="error-message">{errors.expiry}</span>}
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentDetails.creditCard.cvv}
                          onChange={handlePaymentDetailsChange}
                          placeholder="123"
                          maxLength="4"
                          className={errors.cvv ? 'error' : ''}
                        />
                        {errors.cvv && <span className="error-message">{errors.cvv}</span>}
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
                  {loading ? 'Processing...' : `Pay ৳${grandTotal}`}
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
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">৳{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>৳{total}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>৳{shippingCost}</span>
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
                <FaShieldAlt />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

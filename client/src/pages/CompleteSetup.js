import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './CompleteSetup.css';

const CompleteSetup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      toast.error('Invalid verification link');
      navigate('/login');
    }
  }, [token, email, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await fetch('http://localhost:5000/api/auth/complete-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success('Account setup completed successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(data.message || 'Failed to complete setup');
      }
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="complete-setup-page">
        <div className="container">
          <div className="setup-card success">
            <FaCheckCircle className="success-icon" />
            <h1>Account Setup Complete!</h1>
            <p>Your account has been successfully set up with a permanent password.</p>
            <p>You can now log in with your email and new password.</p>
            <div className="redirect-message">
              Redirecting to login page...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="complete-setup-page">
        <div className="container">
          <div className="setup-card error">
            <FaExclamationTriangle className="error-icon" />
            <h1>Invalid Link</h1>
            <p>The verification link is invalid or has expired.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="complete-setup-page">
      <div className="container">
        <div className="setup-card">
          <FaLock className="setup-icon" />
          <h1>Complete Your Account Setup</h1>
          <p className="setup-description">
            Welcome! To complete your account setup, please create a permanent password for your account.
          </p>

          <form onSubmit={handleSubmit} className="setup-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'error' : ''}`}
                placeholder="Enter your new password"
                minLength="6"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your new password"
                minLength="6"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="password-requirements">
              <h4>Password Requirements:</h4>
              <ul>
                <li className={formData.password.length >= 6 ? 'met' : ''}>
                  At least 6 characters long
                </li>
                <li className={formData.password && formData.confirmPassword && formData.password === formData.confirmPassword ? 'met' : ''}>
                  Passwords match
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="btn btn-primary setup-btn"
              disabled={loading}
            >
              {loading ? 'Setting Up...' : 'Complete Setup'}
            </button>
          </form>

          <div className="setup-footer">
            <p>
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="link-btn">
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteSetup;

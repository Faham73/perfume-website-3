import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid verification link');
      setLoading(false);
      return;
    }

    verifyEmail();
  }, [token, email]);

  const verifyEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Verification failed');
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('An error occurred during verification');
      toast.error('An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="verify-email-page">
        <div className="container">
          <div className="verify-card">
            <FaEnvelope className="verify-icon" />
            <h1>Verifying Your Email</h1>
            <div className="spinner"></div>
            <p>Please wait while we verify your email address...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="verify-email-page">
        <div className="container">
          <div className="verify-card success">
            <FaCheckCircle className="success-icon" />
            <h1>Email Verified Successfully!</h1>
            <p>Your email address has been verified. You can now log in to your account.</p>
            <div className="redirect-message">
              Redirecting to login page...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verify-email-page">
        <div className="container">
          <div className="verify-card error">
            <FaExclamationTriangle className="error-icon" />
            <h1>Verification Failed</h1>
            <p>{error}</p>
            <p>The verification link may be invalid or expired.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmail;

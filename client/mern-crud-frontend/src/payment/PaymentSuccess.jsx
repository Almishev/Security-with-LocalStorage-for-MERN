import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/axiosConfig.js';
import toast from 'react-hot-toast';
import './payment.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const checkPayment = async () => {
      if (!sessionId) {
        toast.error('No session ID provided');
        navigate('/employee');
        return;
      }

      try {
        
        const response = await api.get(`/payment/check-status/${sessionId}`);
        
        if (response.data.paid) {
          setPaymentStatus('success');
          toast.success('Payment successful! Your account has been upgraded.');
          
          setTimeout(() => {
            navigate('/employee');
          }, 3000);
        } else {
          setPaymentStatus('pending');
          toast.info('Payment is being processed...');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('error');
        toast.error('Error verifying payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="payment-success-container">
        <div className="payment-success-card">
          <div className="spinner"></div>
          <h2>Verifying payment...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        {paymentStatus === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your account has been upgraded. You now have full access to all employee records.</p>
            <p>Redirecting to employee list...</p>
          </>
        )}
        {paymentStatus === 'pending' && (
          <>
            <div className="pending-icon">⏳</div>
            <h2>Payment Processing</h2>
            <p>Your payment is being processed. Please wait a moment.</p>
          </>
        )}
        {paymentStatus === 'error' && (
          <>
            <div className="error-icon">✗</div>
            <h2>Payment Verification Error</h2>
            <p>There was an error verifying your payment. Please contact support if the issue persists.</p>
            <button onClick={() => navigate('/employee')} className="btn btn-primary">
              Go to Employee List
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;


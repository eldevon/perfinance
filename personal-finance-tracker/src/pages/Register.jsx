import React from 'react';
import RegisterForm from '../components/Auth/Register';
import './AuthPages.css';

const Register = () => {
  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-overlay">
          <div className="auth-welcome">
            <h1>Join Finance Tracker</h1>
            <p>Start your journey to financial freedom today</p>
            <div className="auth-benefits">
              <div className="benefit">
                <span className="benefit-icon">🔒</span>
                <span>Secure local storage</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">📱</span>
                <span>Mobile-friendly design</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🎨</span>
                <span>Dark mode support</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔄</span>
                <span>Recurring transactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auth-form-container">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;

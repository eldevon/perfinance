import React from 'react';
import LoginForm from '../components/Auth/Login';
import './AuthPages.css';

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-overlay">
          <div className="auth-welcome">
            <h1>Finance Tracker Pro</h1>
            <p>Take control of your finances with our powerful tracking tools</p>
            <div className="auth-features">
              <div className="feature">
                <span className="feature-icon">💰</span>
                <span>Track expenses & income</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>Set financial goals</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Detailed analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auth-form-container">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

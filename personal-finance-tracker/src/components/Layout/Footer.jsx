import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Built with ❤️ using React & LocalStorage | 
          Data is stored locally in your browser
        </p>
        <p className="footer-note">
          Note: Clear browser data will delete all your financial records
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../Common/ThemeToggle';
import { formatCurrency } from '../../utils/formatters';
import { FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const { balance, totalIncome, totalExpenses } = useFinance();
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>💰 Finance Tracker</h1>
          <p>Welcome back, {user?.name || 'User'}!</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-label">Balance</span>
            <span className={`stat-value ${parseFloat(balance) >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(parseFloat(balance))}
            </span>
          </div>
          
          <div className="stat-card">
            <span className="stat-label">Income</span>
            <span className="stat-value positive">
              {formatCurrency(parseFloat(totalIncome))}
            </span>
          </div>
          
          <div className="stat-card">
            <span className="stat-label">Expenses</span>
            <span className="stat-value negative">
              {formatCurrency(parseFloat(totalExpenses))}
            </span>
          </div>
        </div>
        
        <div className="header-actions">
          <ThemeToggle />
          
          <button className="notification-btn">
            <FiBell />
            <span className="notification-badge">3</span>
          </button>
          
          <div className="profile-menu">
            <button 
              className="profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <FiUser />
            </button>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <span className="profile-name">{user?.name}</span>
                  <span className="profile-email">{user?.email}</span>
                </div>
                <div className="profile-actions">
                  <button className="dropdown-item">
                    <FiUser /> Profile
                  </button>
                  <button className="dropdown-item" onClick={logout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
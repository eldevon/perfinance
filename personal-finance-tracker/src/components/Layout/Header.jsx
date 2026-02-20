import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import './Header.css';

const Header = () => {
  const { balance, totalIncome, totalExpenses } = useFinance();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>💰 Finance Tracker</h1>
          <p>Track your money, grow your wealth</p>
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
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { FiTrash2 } from 'react-icons/fi';
import './BudgetCard.css';

const BudgetCard = ({ budget }) => {
  const { deleteBudget, categories } = useFinance();
  
  const categoryColor = categories.find(c => c.name === budget.category)?.color || '#666';
  const progress = Math.min(budget.progress, 100);
  const progressColor = budget.isOverBudget ? '#FF6B6B' : progress > 80 ? '#FFD166' : '#06D6A0';

  return (
    <div className="budget-card">
      <div className="budget-header">
        <div className="budget-category">
          <span 
            className="category-dot" 
            style={{ backgroundColor: categoryColor }}
          />
          <h4>{budget.category}</h4>
        </div>
        <button 
          onClick={() => deleteBudget(budget.id)}
          className="delete-budget-btn"
        >
          <FiTrash2 />
        </button>
      </div>
      
      <div className="budget-details">
        <div className="budget-amounts">
          <div className="amount-item">
            <span className="amount-label">Budget:</span>
            <span className="amount-value">
              {formatCurrency(parseFloat(budget.amount))}
            </span>
          </div>
          <div className="amount-item">
            <span className="amount-label">Spent:</span>
            <span className="amount-value">
              {formatCurrency(parseFloat(budget.spent))}
            </span>
          </div>
          <div className="amount-item">
            <span className="amount-label">Remaining:</span>
            <span className={`amount-value ${parseFloat(budget.remaining) >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(parseFloat(budget.remaining))}
            </span>
          </div>
        </div>
        
        <div className="budget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${progress}%`,
                backgroundColor: progressColor
              }}
            />
          </div>
          <div className="progress-label">
            <span>{progress}% spent</span>
            {budget.isOverBudget && (
              <span className="over-budget">Over Budget!</span>
            )}
          </div>
        </div>
        
        <div className="budget-period">
          <span className="period-badge">{budget.period}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;

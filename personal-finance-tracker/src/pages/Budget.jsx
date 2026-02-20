import React from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Common/Card';
import BudgetForm from '../components/Budget/BudgetForm';
import BudgetCard from '../components/Budget/BudgetCard';
import { formatCurrency } from '../utils/formatters';
import './Budget.css';

const Budget = () => {
  const { budgets } = useFinance();

  const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount), 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + parseFloat(budget.spent), 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="budget-page">
      <div className="page-header">
        <h2>Budget Management</h2>
        <p>Plan and track your spending</p>
      </div>
      
      <div className="budget-summary">
        <Card className="summary-card">
          <div className="summary-stats">
            <div className="stat-item">
              <h4>Total Budget</h4>
              <p className="stat-value">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="stat-item">
              <h4>Total Spent</h4>
              <p className="stat-value negative">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="stat-item">
              <h4>Total Remaining</h4>
              <p className={`stat-value ${totalRemaining >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(totalRemaining)}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="budget-content">
        <div className="budget-form-section">
          <Card title="Create Budget">
            <BudgetForm />
          </Card>
        </div>
        
        <div className="budgets-section">
          <Card 
            title="Your Budgets" 
            action={<span className="budget-count">{budgets.length} budgets</span>}
          >
            {budgets.length > 0 ? (
              <div className="budgets-grid">
                {budgets.map(budget => (
                  <BudgetCard key={budget.id} budget={budget} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No budgets created yet. Create your first budget to start tracking!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Budget;

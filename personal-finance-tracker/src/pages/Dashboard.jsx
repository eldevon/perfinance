import React from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Common/Card';
import ExpenseChart from '../components/Charts/ExpenseChart';
import IncomeChart from '../components/Charts/IncomeChart';
import GoalProgress from '../components/Goals/GoalProgress';
import TransactionForm from '../components/Transactions/TransactionForm';
import BudgetCard from '../components/Budget/BudgetCard';
import { formatCurrency } from '../utils/formatters';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiTarget, FiRepeat } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { 
    balance, 
    totalIncome, 
    totalExpenses, 
    recentTransactions,
    budgets,
    goals,
    recurringTransactions 
  } = useFinance();

  const activeGoals = goals.filter(g => !g.isCompleted);
  const activeRecurring = recurringTransactions.filter(t => {
    const today = new Date();
    const endDate = t.endDate ? new Date(t.endDate) : null;
    return !endDate || endDate > today;
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back! Here's your financial summary</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-row">
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon income">
                <FiTrendingUp />
              </div>
              <div className="stat-info">
                <h4>Total Income</h4>
                <p className="stat-value">{formatCurrency(parseFloat(totalIncome))}</p>
              </div>
            </div>
          </Card>
          
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon expense">
                <FiTrendingDown />
              </div>
              <div className="stat-info">
                <h4>Total Expenses</h4>
                <p className="stat-value">{formatCurrency(parseFloat(totalExpenses))}</p>
              </div>
            </div>
          </Card>
          
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon balance">
                <FiDollarSign />
              </div>
              <div className="stat-info">
                <h4>Current Balance</h4>
                <p className={`stat-value ${parseFloat(balance) >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(parseFloat(balance))}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon goal">
                <FiTarget />
              </div>
              <div className="stat-info">
                <h4>Active Goals</h4>
                <p className="stat-value">{activeGoals.length}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Charts and Forms */}
        <div className="main-content-row">
          <div className="chart-section">
            <Card title="Financial Overview">
              <IncomeChart />
            </Card>
          </div>
          
          <div className="form-section">
            <Card title="Quick Add Transaction">
              <TransactionForm />
            </Card>
          </div>
        </div>
        
        {/* Goals and Recurring */}
        <div className="middle-row">
          <div className="goals-section">
            <Card 
              title="Goals Progress" 
              action={<span className="goal-count">{activeGoals.length} active</span>}
            >
              <GoalProgress />
            </Card>
          </div>
          
          <div className="recurring-section">
            <Card 
              title="Recurring Transactions" 
              action={<span className="recurring-count">{activeRecurring.length} active</span>}
            >
              <div className="recurring-summary">
                <div className="recurring-stats">
                  <div className="recurring-stat">
                    <span className="stat-label">Monthly Total</span>
                    <span className="stat-value">
                      {formatCurrency(activeRecurring.reduce((sum, t) => {
                        const multiplier = t.frequency === 'monthly' ? 1 : 
                                         t.frequency === 'weekly' ? 4.33 :
                                         t.frequency === 'yearly' ? 1/12 : 1;
                        return sum + (t.amount * multiplier);
                      }, 0))}
                    </span>
                  </div>
                  <div className="recurring-stat">
                    <span className="stat-label">Next Due</span>
                    <span className="stat-value">
                      {activeRecurring.length > 0 ? 'Tomorrow' : 'None'}
                    </span>
                  </div>
                </div>
                <div className="recurring-list-preview">
                  {activeRecurring.slice(0, 3).map(transaction => (
                    <div key={transaction.id} className="recurring-item">
                      <span className="recurring-desc">{transaction.description}</span>
                      <span className={`recurring-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                  {activeRecurring.length === 0 && (
                    <div className="empty-recurring">
                      <FiRepeat />
                      <p>No recurring transactions</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Budgets and Recent Transactions */}
        <div className="bottom-row">
          <div className="budgets-section">
            <Card 
              title="Your Budgets" 
              action={<span className="budget-count">{budgets.length} budgets</span>}
            >
              <div className="budgets-grid">
                {budgets.length > 0 ? (
                  budgets.slice(0, 3).map(budget => (
                    <BudgetCard key={budget.id} budget={budget} />
                  ))
                ) : (
                  <div className="empty-budgets">
                    <p>No budgets set. Create your first budget!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          <div className="transactions-section">
            <Card 
              title="Recent Transactions" 
              action={<a href="/transactions" className="view-all">View All</a>}
            >
              <div className="recent-transactions">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map(transaction => (
                    <div key={transaction.id} className="recent-transaction">
                      <div className="transaction-info">
                        <span className="transaction-desc">
                          {transaction.description}
                        </span>
                        <span className="transaction-category">
                          {transaction.category}
                        </span>
                      </div>
                      <div className="transaction-amount">
                        <span className={`amount ${transaction.type}`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-transactions">
                    <p>No transactions yet. Add your first transaction!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

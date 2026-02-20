import React from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Common/Card';
import ExpenseChart from '../components/Charts/ExpenseChart';
import IncomeChart from '../components/Charts/IncomeChart';
import TransactionForm from '../components/Transactions/TransactionForm';
import BudgetCard from '../components/Budget/BudgetCard';
import { formatCurrency } from '../utils/formatters';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { 
    balance, 
    totalIncome, 
    totalExpenses, 
    recentTransactions,
    budgets 
  } = useFinance();

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
        
        {/* Budgets and Recent Transactions */}
        <div className="bottom-row">
          <div className="budgets-section">
            <Card 
              title="Your Budgets" 
              action={<span className="budget-count">{budgets.length} budgets</span>}
            >
              <div className="budgets-grid">
                {budgets.length > 0 ? (
                  budgets.map(budget => (
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


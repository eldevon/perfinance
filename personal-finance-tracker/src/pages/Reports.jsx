import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Common/Card';
import ExpenseChart from '../components/Charts/ExpenseChart';
import IncomeChart from '../components/Charts/IncomeChart';
import { formatCurrency } from '../utils/formatters';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import './Reports.css';

const Reports = () => {
  const { transactions, totalIncome, totalExpenses, balance } = useFinance();
  const [reportType, setReportType] = useState('monthly');

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        `"${t.description}"`,
        t.category,
        t.type,
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-report.csv';
    a.click();
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <h2>Financial Reports</h2>
        <p>Analyze your financial data</p>
      </div>
      
      <div className="reports-actions">
        <div className="report-type-selector">
          <button 
            className={`type-btn ${reportType === 'monthly' ? 'active' : ''}`}
            onClick={() => setReportType('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`type-btn ${reportType === 'yearly' ? 'active' : ''}`}
            onClick={() => setReportType('yearly')}
          >
            Yearly
          </button>
        </div>
        
        <div className="export-actions">
          <button onClick={exportToCSV} className="export-btn">
            <FiDownload /> Export CSV
          </button>
          <button onClick={printReport} className="export-btn">
            <FiPrinter /> Print Report
          </button>
        </div>
      </div>
      
      <div className="reports-summary">
        <Card className="summary-card">
          <div className="summary-stats">
            <div className="stat-item">
              <h4>Total Income</h4>
              <p className="stat-value positive">{formatCurrency(parseFloat(totalIncome))}</p>
            </div>
            <div className="stat-item">
              <h4>Total Expenses</h4>
              <p className="stat-value negative">{formatCurrency(parseFloat(totalExpenses))}</p>
            </div>
            <div className="stat-item">
              <h4>Net Balance</h4>
              <p className={`stat-value ${parseFloat(balance) >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(parseFloat(balance))}
              </p>
            </div>
            <div className="stat-item">
              <h4>Total Transactions</h4>
              <p className="stat-value">{transactions.length}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="reports-charts">
        <div className="chart-card">
          <Card title="Income vs Expenses">
            <IncomeChart />
          </Card>
        </div>
        
        <div className="chart-card">
          <Card title="Expense Distribution">
            <ExpenseChart />
          </Card>
        </div>
      </div>
      
      <div className="transactions-table-section">
        <Card title="Transaction History">
          <div className="transactions-table">
            <div className="table-header">
              <div className="table-cell">Date</div>
              <div className="table-cell">Description</div>
              <div className="table-cell">Category</div>
              <div className="table-cell">Type</div>
              <div className="table-cell">Amount</div>
            </div>
            
            {transactions.slice(0, 10).map(transaction => (
              <div key={transaction.id} className="table-row">
                <div className="table-cell">
                  {new Date(transaction.date).toLocaleDateString()}
                </div>
                <div className="table-cell">{transaction.description}</div>
                <div className="table-cell">{transaction.category}</div>
                <div className="table-cell">
                  <span className={`type-badge ${transaction.type}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="table-cell">
                  <span className={`amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="empty-state">
                <p>No transactions to display</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;

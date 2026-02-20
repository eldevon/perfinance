import React from 'react';
import Card from '../components/Common/Card';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionList from '../components/Transactions/TransactionList';
import './Transactions.css';

const Transactions = () => {
  return (
    <div className="transactions-page">
      <div className="page-header">
        <h2>Transactions</h2>
        <p>Manage your income and expenses</p>
      </div>
      
      <div className="transactions-content">
        <div className="transactions-form">
          <Card title="Add Transaction">
            <TransactionForm />
          </Card>
        </div>
        
        <div className="transactions-list">
          <Card title="All Transactions">
            <TransactionList />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

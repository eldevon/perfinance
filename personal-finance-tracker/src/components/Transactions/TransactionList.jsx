import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import TransactionItem from './TransactionItem';
import Input from '../Common/Input';
import { FiSearch, FiFilter } from 'react-icons/fi';
import './TransactionList.css';

const TransactionList = () => {
  const { transactions } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [...new Set(transactions.map(t => t.category))];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="transaction-list">
      <div className="transaction-filters">
        <Input
          icon={<FiSearch />}
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="filter-group">
          <div className="input-group">
            <label className="input-label">
              <FiFilter /> Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <div className="input-group">
            <label className="input-label">
              <FiFilter /> Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="transactions-container">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found. Add your first transaction!</p>
          </div>
        ) : (
          <div className="transactions-table">
            <div className="table-header">
              <div className="table-cell">Description</div>
              <div className="table-cell">Category</div>
              <div className="table-cell">Date</div>
              <div className="table-cell">Type</div>
              <div className="table-cell">Amount</div>
              <div className="table-cell">Actions</div>
            </div>
            
            {filteredTransactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>
      
      <div className="transaction-summary">
        <p>
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </p>
      </div>
    </div>
  );
};

export default TransactionList;

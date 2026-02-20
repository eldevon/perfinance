import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FiRepeat, FiEdit2, FiTrash2, FiCalendar, FiInfo } from 'react-icons/fi';
import './RecurringList.css';

const RecurringList = () => {
  const { recurringTransactions, deleteRecurringTransaction } = useFinance();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const getStatus = (transaction) => {
    const today = new Date();
    const endDate = transaction.endDate ? new Date(transaction.endDate) : null;
    
    if (endDate && endDate < today) {
      return 'ended';
    }
    
    const nextDate = new Date(transaction.nextDate);
    if (nextDate <= today) {
      return 'due';
    }
    
    return 'active';
  };

  const filteredTransactions = recurringTransactions.filter(transaction => {
    const status = getStatus(transaction);
    
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'due': return '#f59e0b';
      case 'ended': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: 'Bi-weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    };
    return labels[frequency] || frequency;
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this recurring transaction?')) {
      deleteRecurringTransaction(id);
    }
  };

  return (
    <div className="recurring-list">
      <div className="list-header">
        <h3>
          <FiRepeat /> Recurring Transactions
        </h3>
        
        <div className="list-filters">
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="due">Due</option>
              <option value="ended">Ended</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <FiRepeat className="empty-icon" />
          <p>No recurring transactions found</p>
          <p className="empty-subtext">Create your first recurring transaction to get started</p>
        </div>
      ) : (
        <div className="transactions-grid">
          {filteredTransactions.map(transaction => {
            const status = getStatus(transaction);
            
            return (
              <div key={transaction.id} className="recurring-card">
                <div className="card-header">
                  <div className="transaction-info">
                    <h4>{transaction.description}</h4>
                    <div className="transaction-meta">
                      <span className={`type-badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
                      <span className="frequency-badge">
                        {getFrequencyLabel(transaction.frequency)}
                      </span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(status) }}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="transaction-amount">
                    <span className={`amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
                
                <div className="card-details">
                  <div className="detail-item">
                    <FiCalendar className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Next Occurrence:</span>
                      <span className="detail-value">
                        {formatDate(transaction.nextDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FiInfo className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{transaction.category}</span>
                    </div>
                  </div>
                  
                  {transaction.notes && (
                    <div className="detail-item">
                      <div className="detail-content">
                        <span className="detail-label">Notes:</span>
                        <span className="detail-value notes">{transaction.notes}</span>
                      </div>
                    </div>
                  )}
                  
                  {transaction.endDate && (
                    <div className="detail-item">
                      <div className="detail-content">
                        <span className="detail-label">Ends:</span>
                        <span className="detail-value">
                          {formatDate(transaction.endDate)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => {/* Handle edit */}}
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="list-summary">
        <p>
          Showing {filteredTransactions.length} of {recurringTransactions.length} recurring transactions
        </p>
        <div className="summary-stats">
          <span className="stat">
            Active: {recurringTransactions.filter(t => getStatus(t) === 'active').length}
          </span>
          <span className="stat">
            Due: {recurringTransactions.filter(t => getStatus(t) === 'due').length}
          </span>
          <span className="stat">
            Ended: {recurringTransactions.filter(t => getStatus(t) === 'ended').length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecurringList;

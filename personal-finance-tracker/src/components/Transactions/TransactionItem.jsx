import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import './TransactionItem.css';

const TransactionItem = ({ transaction }) => {
  const { deleteTransaction, updateTransaction, categories } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(transaction);

  const handleSave = () => {
    updateTransaction(transaction.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(transaction);
    setIsEditing(false);
  };

  const categoryColor = categories.find(c => c.name === transaction.category)?.color || '#666';

  if (isEditing) {
    return (
      <div className="transaction-item editing">
        <input
          type="text"
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="edit-input"
        />
        
        <select
          value={editData.category}
          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
          className="edit-select"
        >
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        
        <input
          type="date"
          value={editData.date.split('T')[0]}
          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
          className="edit-input"
        />
        
        <select
          value={editData.type}
          onChange={(e) => setEditData({ ...editData, type: e.target.value })}
          className="edit-select"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <input
          type="number"
          value={editData.amount}
          onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
          className="edit-input"
          step="0.01"
        />
        
        <div className="action-buttons">
          <button onClick={handleSave} className="action-btn save">
            <FiCheck />
          </button>
          <button onClick={handleCancel} className="action-btn cancel">
            <FiX />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-item">
      <div className="table-cell" style={{ color: categoryColor }}>
        {transaction.description}
      </div>
      <div className="table-cell">
        <span className="category-badge" style={{ backgroundColor: categoryColor }}>
          {transaction.category}
        </span>
      </div>
      <div className="table-cell">{formatDate(transaction.date)}</div>
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
      <div className="table-cell">
        <div className="action-buttons">
          <button 
            onClick={() => setIsEditing(true)} 
            className="action-btn edit"
          >
            <FiEdit2 />
          </button>
          <button 
            onClick={() => deleteTransaction(transaction.id)} 
            className="action-btn delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;

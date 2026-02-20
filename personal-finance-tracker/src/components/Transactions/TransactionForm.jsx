import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { FiPlus } from 'react-icons/fi';
import './TransactionForm.css';

const TransactionForm = () => {
  const { addTransaction, categories } = useFinance();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>Add New Transaction</h3>
      
      <div className="form-row">
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          error={errors.description}
          required
        />
        
        <Input
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          error={errors.amount}
          required
        />
      </div>
      
      <div className="form-row">
        <div className="input-group">
          <label className="input-label">Type</label>
          <div className="type-toggle">
            <button
              type="button"
              className={`type-btn ${formData.type === 'expense' ? 'active' : ''}`}
              onClick={() => {
                setFormData(prev => ({ ...prev, type: 'expense', category: '' }));
                setErrors(prev => ({ ...prev, category: '' }));
              }}
            >
              Expense
            </button>
            <button
              type="button"
              className={`type-btn ${formData.type === 'income' ? 'active' : ''}`}
              onClick={() => {
                setFormData(prev => ({ ...prev, type: 'income', category: '' }));
                setErrors(prev => ({ ...prev, category: '' }));
              }}
            >
              Income
            </button>
          </div>
        </div>
        
        <div className="input-group">
          <label className="input-label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`input-field ${errors.category ? 'error' : ''}`}
            required
          >
            <option value="">Select category</option>
            {(formData.type === 'expense' ? expenseCategories : incomeCategories).map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="input-error">{errors.category}</span>}
        </div>
      </div>
      
      <div className="form-row">
        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      
      <Button type="submit" icon={<FiPlus />} fullWidth>
        Add Transaction
      </Button>
    </form>
  );
};

export default TransactionForm;

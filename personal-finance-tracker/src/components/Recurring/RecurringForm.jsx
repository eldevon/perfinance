import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { FiRepeat, FiPlus } from 'react-icons/fi';
import './RecurringForm.css';

const RecurringForm = () => {
  const { addRecurringTransaction, categories } = useFinance();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
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
    
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      addRecurringTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: ''
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

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <form className="recurring-form" onSubmit={handleSubmit}>
      <h3>
        <FiRepeat /> Create Recurring Transaction
      </h3>
      
      <div className="form-row">
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Netflix Subscription, Salary"
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
        <div className="input-group">
          <label className="input-label">Frequency</label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="input-field"
          >
            {frequencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-row">
        <Input
          label="End Date (Optional)"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
          min={formData.startDate}
        />
        
        <div className="input-group">
          <label className="input-label">Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input-field"
            rows="2"
            placeholder="Add any notes about this recurring transaction"
          />
        </div>
      </div>
      
      <div className="form-preview">
        <h4>Preview:</h4>
        <p>
          {formData.description || 'Description'} - {formData.amount || '0.00'} 
          {' '}({formData.type || 'type'}) - {formData.frequency || 'frequency'}
        </p>
      </div>
      
      <Button type="submit" icon={<FiPlus />} fullWidth>
        Create Recurring Transaction
      </Button>
    </form>
  );
};

export default RecurringForm;

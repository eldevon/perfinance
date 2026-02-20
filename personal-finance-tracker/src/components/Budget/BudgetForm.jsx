import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { FiPlus } from 'react-icons/fi';
import './BudgetForm.css';

const BudgetForm = () => {
  const { addBudget, categories } = useFinance();
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly',
  });
  const [errors, setErrors] = useState({});

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      addBudget({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      
      setFormData({
        category: '',
        amount: '',
        period: 'monthly',
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
    <form className="budget-form" onSubmit={handleSubmit}>
      <h3>Create New Budget</h3>
      
      <div className="form-row">
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
            {expenseCategories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="input-error">{errors.category}</span>}
        </div>
        
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
          <label className="input-label">Period</label>
          <select
            name="period"
            value={formData.period}
            onChange={handleChange}
            className="input-field"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      
      <Button type="submit" icon={<FiPlus />} fullWidth>
        Create Budget
      </Button>
    </form>
  );
};

export default BudgetForm;

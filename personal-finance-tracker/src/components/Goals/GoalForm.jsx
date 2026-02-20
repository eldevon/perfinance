import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { FiTarget, FiPlus } from 'react-icons/fi';
import './GoalForm.css';

const GoalForm = () => {
  const { addGoal } = useFinance();
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'Savings',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }
    
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }
    
    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      addGoal({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
      });
      
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        category: 'Savings',
        priority: 'medium'
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
    <form className="goal-form" onSubmit={handleSubmit}>
      <h3>
        <FiTarget /> Create New Goal
      </h3>
      
      <div className="form-row">
        <Input
          label="Goal Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Vacation, New Car, Emergency Fund"
          error={errors.name}
          required
        />
        
        <Input
          label="Target Amount"
          name="targetAmount"
          type="number"
          value={formData.targetAmount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          error={errors.targetAmount}
          required
        />
      </div>
      
      <div className="form-row">
        <Input
          label="Current Amount"
          name="currentAmount"
          type="number"
          value={formData.currentAmount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
        
        <Input
          label="Deadline (Optional)"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          error={errors.deadline}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      <div className="form-row">
        <div className="input-group">
          <label className="input-label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Savings">Savings</option>
            <option value="Vacation">Vacation</option>
            <option value="Car">Car</option>
            <option value="House">House</option>
            <option value="Education">Education</option>
            <option value="Retirement">Retirement</option>
            <option value="Emergency">Emergency Fund</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="input-group">
          <label className="input-label">Priority</label>
          <div className="priority-buttons">
            <button
              type="button"
              className={`priority-btn ${formData.priority === 'low' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, priority: 'low' }))}
            >
              Low
            </button>
            <button
              type="button"
              className={`priority-btn ${formData.priority === 'medium' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, priority: 'medium' }))}
            >
              Medium
            </button>
            <button
              type="button"
              className={`priority-btn ${formData.priority === 'high' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, priority: 'high' }))}
            >
              High
            </button>
          </div>
        </div>
      </div>
      
      <Button type="submit" icon={<FiPlus />} fullWidth>
        Create Goal
      </Button>
    </form>
  );
};

export default GoalForm;

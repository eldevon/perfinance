import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { FiTarget, FiEdit2, FiTrash2, FiDollarSign } from 'react-icons/fi';
import './GoalCard.css';

const GoalCard = ({ goal }) => {
  const { updateGoal, deleteGoal, contributeToGoal } = useFinance();
  const [contributionAmount, setContributionAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(goal);

  const progress = parseFloat(goal.progress);
  const remaining = parseFloat(goal.remaining);
  
  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleContribute = (e) => {
    e.preventDefault();
    if (contributionAmount && parseFloat(contributionAmount) > 0) {
      contributeToGoal(goal.id, parseFloat(contributionAmount));
      setContributionAmount('');
    }
  };

  const handleSave = () => {
    updateGoal(goal.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(goal);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="goal-card editing">
        <input
          type="text"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          className="edit-input"
          placeholder="Goal name"
        />
        
        <div className="edit-row">
          <input
            type="number"
            value={editData.targetAmount}
            onChange={(e) => setEditData({ ...editData, targetAmount: e.target.value })}
            className="edit-input"
            placeholder="Target amount"
            step="0.01"
          />
          
          <select
            value={editData.priority}
            onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
            className="edit-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="edit-actions">
          <button onClick={handleSave} className="edit-btn save">
            Save
          </button>
          <button onClick={handleCancel} className="edit-btn cancel">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="goal-card">
      <div className="goal-header">
        <div className="goal-title">
          <FiTarget className="goal-icon" />
          <h4>{goal.name}</h4>
          <span 
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor() }}
          >
            {goal.priority}
          </span>
        </div>
        
        <div className="goal-actions">
          <button 
            onClick={() => setIsEditing(true)} 
            className="action-btn edit"
          >
            <FiEdit2 />
          </button>
          <button 
            onClick={() => deleteGoal(goal.id)} 
            className="action-btn delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
      
      <div className="goal-details">
        <div className="goal-amounts">
          <div className="amount-item">
            <span className="amount-label">Target:</span>
            <span className="amount-value">
              {formatCurrency(parseFloat(goal.targetAmount))}
            </span>
          </div>
          <div className="amount-item">
            <span className="amount-label">Current:</span>
            <span className="amount-value">
              {formatCurrency(parseFloat(goal.currentAmount))}
            </span>
          </div>
          <div className="amount-item">
            <span className="amount-label">Remaining:</span>
            <span className="amount-value">
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>
        
        <div className="goal-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${progress}%`,
                backgroundColor: getPriorityColor()
              }}
            />
          </div>
          <div className="progress-label">
            <span>{progress}% Complete</span>
            {goal.daysRemaining > 0 && (
              <span className="days-remaining">
                {goal.daysRemaining} days left
              </span>
            )}
          </div>
        </div>
        
        {!goal.isCompleted && (
          <form className="contribution-form" onSubmit={handleContribute}>
            <div className="contribution-input">
              <FiDollarSign className="currency-icon" />
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="Add contribution"
                step="0.01"
                min="0.01"
                max={remaining}
              />
              <button type="submit" className="contribute-btn">
                Add
              </button>
            </div>
            <small className="hint">
              Max: {formatCurrency(remaining)}
            </small>
          </form>
        )}
        
        {goal.isCompleted && (
          <div className="goal-completed">
            <span className="completed-badge">🎉 Goal Achieved!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCard;

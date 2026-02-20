import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { FiTarget, FiTrendingUp } from 'react-icons/fi';
import './GoalProgress.css';

const GoalProgress = () => {
  const { goals } = useFinance();

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.isCompleted).length;
  const totalTarget = goals.reduce((sum, g) => sum + parseFloat(g.targetAmount), 0);
  const totalCurrent = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount), 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const priorityGoals = goals.filter(g => g.priority === 'high' && !g.isCompleted);
  const upcomingDeadlines = goals
    .filter(g => g.deadline && !g.isCompleted)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  return (
    <div className="goal-progress-widget">
      <div className="widget-header">
        <h3>
          <FiTarget /> Goals Overview
        </h3>
        <span className="goal-count">
          {completedGoals}/{totalGoals} completed
        </span>
      </div>
      
      <div className="overall-progress">
        <div className="progress-circle">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#3b82f6"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${overallProgress * 2.26} 226`}
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="progress-text">
            <span className="progress-percent">
              {overallProgress.toFixed(1)}%
            </span>
            <span className="progress-label">Overall</span>
          </div>
        </div>
        
        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-label">Total Target</span>
            <span className="stat-value">
              {formatCurrency(totalTarget)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Saved</span>
            <span className="stat-value">
              {formatCurrency(totalCurrent)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Remaining</span>
            <span className="stat-value">
              {formatCurrency(totalTarget - totalCurrent)}
            </span>
          </div>
        </div>
      </div>
      
      {priorityGoals.length > 0 && (
        <div className="priority-goals">
          <h4>
            <FiTrendingUp /> Priority Goals
          </h4>
          <div className="priority-list">
            {priorityGoals.map(goal => (
              <div key={goal.id} className="priority-item">
                <span className="goal-name">{goal.name}</span>
                <span className="goal-progress-text">
                  {parseFloat(goal.progress).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {upcomingDeadlines.length > 0 && (
        <div className="upcoming-deadlines">
          <h4>Upcoming Deadlines</h4>
          <div className="deadline-list">
            {upcomingDeadlines.map(goal => (
              <div key={goal.id} className="deadline-item">
                <span className="goal-name">{goal.name}</span>
                <span className="deadline-date">
                  {new Date(goal.deadline).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;

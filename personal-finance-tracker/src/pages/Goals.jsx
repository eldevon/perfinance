import React from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Common/Card';
import GoalForm from '../components/Goals/GoalForm';
import GoalCard from '../components/Goals/GoalCard';
import GoalProgress from '../components/Goals/GoalProgress';
import { formatCurrency } from '../utils/formatters';
import { FiTarget, FiTrendingUp } from 'react-icons/fi';
import './Goals.css';

const Goals = () => {
  const { goals } = useFinance();

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.isCompleted).length;
  const totalTarget = goals.reduce((sum, g) => sum + parseFloat(g.targetAmount), 0);
  const totalCurrent = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount), 0);
  const totalRemaining = totalTarget - totalCurrent;

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoalsList = goals.filter(g => g.isCompleted);

  return (
    <div className="goals-page">
      <div className="page-header">
        <h2>
          <FiTarget /> Financial Goals
        </h2>
        <p>Track and achieve your financial objectives</p>
      </div>
      
      <div className="goals-summary">
        <Card className="summary-card">
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <FiTarget />
              </div>
              <div className="stat-info">
                <h4>Total Goals</h4>
                <p className="stat-value">{totalGoals}</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon completed">
                <FiTrendingUp />
              </div>
              <div className="stat-info">
                <h4>Completed</h4>
                <p className="stat-value">{completedGoals}</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <span className="currency">$</span>
              </div>
              <div className="stat-info">
                <h4>Total Target</h4>
                <p className="stat-value">{formatCurrency(totalTarget)}</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <span className="currency">$</span>
              </div>
              <div className="stat-info">
                <h4>Remaining</h4>
                <p className={`stat-value ${totalRemaining >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(totalRemaining)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="goals-content">
        <div className="goals-sidebar">
          <Card title="Create New Goal">
            <GoalForm />
          </Card>
          
          <Card title="Goals Progress">
            <GoalProgress />
          </Card>
        </div>
        
        <div className="goals-main">
          <Card 
            title="Active Goals" 
            action={<span className="goal-count">{activeGoals.length} active</span>}
          >
            {activeGoals.length > 0 ? (
              <div className="goals-grid">
                {activeGoals.map(goal => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No active goals. Create your first goal to get started!</p>
              </div>
            )}
          </Card>
          
          {completedGoalsList.length > 0 && (
            <Card 
              title="Completed Goals" 
              action={<span className="goal-count completed">{completedGoalsList.length} completed</span>}
            >
              <div className="goals-grid">
                {completedGoalsList.map(goal => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;

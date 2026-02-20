import React from 'react';
import Card from '../components/Common/Card';
import RecurringForm from '../components/Recurring/RecurringForm';
import RecurringList from '../components/Recurring/RecurringList';
import { FiRepeat, FiCalendar } from 'react-icons/fi';
import './Recurring.css';

const Recurring = () => {
  return (
    <div className="recurring-page">
      <div className="page-header">
        <h2>
          <FiRepeat /> Recurring Transactions
        </h2>
        <p>Manage your automatic income and expenses</p>
      </div>
      
      <div className="recurring-content">
        <div className="recurring-form-section">
          <Card title="Create Recurring Transaction">
            <RecurringForm />
          </Card>
          
          <Card className="info-card">
            <div className="info-header">
              <FiCalendar className="info-icon" />
              <h4>How Recurring Transactions Work</h4>
            </div>
            <div className="info-content">
              <ul>
                <li>Transactions are automatically created on their scheduled dates</li>
                <li>You can set start and end dates for each transaction</li>
                <li>Transactions can be daily, weekly, monthly, or yearly</li>
                <li>You'll receive notifications for upcoming transactions</li>
                <li>All recurring transactions are tracked in your transaction history</li>
              </ul>
            </div>
          </Card>
        </div>
        
        <div className="recurring-list-section">
          <Card title="All Recurring Transactions">
            <RecurringList />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Recurring;

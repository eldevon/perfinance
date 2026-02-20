import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useFinance } from '../../context/FinanceContext';
import './ExpenseChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = () => {
  const { transactions, categories } = useFinance();

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const categoryTotals = {};
  expenseTransactions.forEach(transaction => {
    const category = transaction.category;
    categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
  });

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(category => {
          const cat = categories.find(c => c.name === category);
          return cat ? cat.color : '#999';
        }),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="expense-chart">
      <h3>Expense Distribution</h3>
      {expenseTransactions.length > 0 ? (
        <div className="chart-container">
          <Pie data={chartData} options={options} />
        </div>
      ) : (
        <div className="no-data">
          <p>No expense data available</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;

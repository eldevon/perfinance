import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { useFinance } from '../../context/FinanceContext';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import './IncomeChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeChart = () => {
  const { transactions } = useFinance();

  const getLastSixMonths = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      months.push(format(date, 'MMM yyyy'));
    }
    return months;
  };

  const calculateMonthlyData = () => {
    const months = getLastSixMonths();
    const monthlyIncome = Array(6).fill(0);
    const monthlyExpenses = Array(6).fill(0);

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = format(transactionDate, 'MMM yyyy');
      
      const monthIndex = months.indexOf(transactionMonth);
      if (monthIndex !== -1) {
        if (transaction.type === 'income') {
          monthlyIncome[monthIndex] += transaction.amount;
        } else {
          monthlyExpenses[monthIndex] += transaction.amount;
        }
      }
    });

    return { months, monthlyIncome, monthlyExpenses };
  };

  const { months, monthlyIncome, monthlyExpenses } = calculateMonthlyData();

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: monthlyIncome,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: monthlyExpenses,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs Expenses (Last 6 Months)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="income-chart">
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default IncomeChart;

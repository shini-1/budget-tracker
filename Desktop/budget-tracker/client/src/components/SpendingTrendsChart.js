import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SpendingTrendsChart = ({ transactions }) => {
  // Group transactions by date
  const dailyData = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dailyData[date]) {
      dailyData[date] = { income: 0, expense: 0 };
    }
    if (transaction.type === 'income') {
      dailyData[date].income += transaction.amount;
    } else {
      dailyData[date].expense += transaction.amount;
    }
  });

  // Get last 14 days
  const sortedDates = Object.keys(dailyData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  }).slice(-14);

  const incomeData = sortedDates.map(date => dailyData[date].income);
  const expenseData = sortedDates.map(date => dailyData[date].expense);

  const data = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#28a745',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Expense',
        data: expenseData,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#dc3545',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 13,
            weight: 600
          },
          padding: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        padding: 12,
        titleFont: {
          size: 13,
          weight: 600
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  if (sortedDates.length === 0) {
    return (
      <div className="chart-container">
        <h4>Spending Trends (14 Days)</h4>
        <p className="no-data">No transaction data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h4>Spending Trends (14 Days)</h4>
      <div style={{ position: 'relative', height: '300px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SpendingTrendsChart;

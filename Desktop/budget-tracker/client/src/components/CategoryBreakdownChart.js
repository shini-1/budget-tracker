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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategoryBreakdownChart = ({ transactions }) => {
  // Group transactions by category
  const categoryData = {};
  
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = 0;
      }
      categoryData[transaction.category] += transaction.amount;
    }
  });

  const sortedCategories = Object.keys(categoryData).sort((a, b) => categoryData[b] - categoryData[a]);
  const amounts = sortedCategories.map(cat => categoryData[cat]);

  const data = {
    labels: sortedCategories,
    datasets: [
      {
        label: 'Spending by Category ($)',
        data: amounts,
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#28a745',
          '#ffc107',
          '#17a2b8',
          '#dc3545',
          '#6c757d'
        ],
        borderColor: [
          '#667eea',
          '#764ba2',
          '#28a745',
          '#ffc107',
          '#17a2b8',
          '#dc3545',
          '#6c757d'
        ],
        borderWidth: 0,
        borderRadius: 6,
        hoverBackgroundColor: [
          '#5568d3',
          '#67418f',
          '#218838',
          '#ffb800',
          '#138496',
          '#c82333',
          '#5a6268'
        ]
      }
    ]
  };

  const options = {
    indexAxis: 'y',
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
          padding: 15
        }
      },
      tooltip: {
        padding: 10,
        titleFont: {
          size: 13,
          weight: 600
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context) {
            return '$' + context.parsed.x.toFixed(2);
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        }
      }
    }
  };

  if (sortedCategories.length === 0) {
    return (
      <div className="chart-container">
        <h4>Spending by Category</h4>
        <p className="no-data">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h4>Spending by Category</h4>
      <div style={{ position: 'relative', height: Math.max(250, sortedCategories.length * 30) }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;

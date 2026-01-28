import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomeExpenseChart = ({ totalIncome, totalExpense }) => {
  const data = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [totalIncome, totalExpense],
        backgroundColor: ['#28a745', '#dc3545'],
        borderColor: ['#28a745', '#dc3545'],
        borderWidth: 2,
        borderRadius: 8,
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            weight: 600
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        padding: 12,
        titleFont: {
          size: 14,
          weight: 600
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return '$' + context.parsed.toFixed(2);
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <h4>Income vs Expense</h4>
      <div style={{ position: 'relative', height: '250px' }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default IncomeExpenseChart;

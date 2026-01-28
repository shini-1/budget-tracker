import React, { useState } from 'react';
import { deleteTransaction } from '../utils/api';
import './BudgetList.css';

const BudgetList = ({ budgets, onBudgetDeleted }) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    
    try {
      setDeleting(id);
      await deleteTransaction(id); // Using transaction delete for now - should be budget delete
      onBudgetDeleted();
    } catch (error) {
      alert('Failed to delete budget: ' + error.message);
      setDeleting(null);
    }
  };

  const getProgressPercentage = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getProgressColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  };

  const isOverBudget = (spent, limit) => spent > limit;

  return (
    <div className="budget-list">
      {budgets.length === 0 ? (
        <p className="no-budgets">No budgets set yet</p>
      ) : (
        budgets.map(budget => (
          <div key={budget._id} className="budget-item">
            <div className="budget-header">
              <h4>{budget.category}</h4>
              <span className="timeline-badge">{budget.timeline || 'monthly'}</span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(budget._id)}
                disabled={deleting === budget._id}
                title="Delete budget"
              >
                ×
              </button>
            </div>

            <div className="budget-progress">
              <div className={`progress-bar ${getProgressColor(budget.spent, budget.limit)}`}>
                <div 
                  className="progress-fill"
                  style={{ width: `${getProgressPercentage(budget.spent, budget.limit)}%` }}
                ></div>
              </div>
            </div>

            <div className="budget-info">
              <div className="spent-info">
                <span className={isOverBudget(budget.spent, budget.limit) ? 'over' : ''}>
                  ₱{budget.spent.toFixed(2)}
                </span>
                <span className="label">spent</span>
              </div>
              <div className="limit-info">
                <span>₱{budget.limit.toFixed(2)}</span>
                <span className="label">limit</span>
              </div>
              <div className="remaining-info">
                <span className={isOverBudget(budget.spent, budget.limit) ? 'over' : ''}>
                  {isOverBudget(budget.spent, budget.limit) 
                    ? `Over by ₱${(budget.spent - budget.limit).toFixed(2)}`
                    : `₱${(budget.limit - budget.spent).toFixed(2)} left`
                  }
                </span>
                <span className="label">remaining</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BudgetList;

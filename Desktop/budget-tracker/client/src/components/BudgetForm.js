import React, { useState } from 'react';
import { createBudget } from '../utils/api';
import './BudgetForm.css';

const BudgetForm = ({ onBudgetAdded }) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [timeline, setTimeline] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];
  const timelines = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom Date Range'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!category || !limit) {
      setError('Please fill in all fields');
      return;
    }

    if (timeline === 'custom' && (!startDate || !endDate)) {
      setError('Please select both start and end dates for custom range');
      return;
    }

    if (timeline === 'custom' && new Date(startDate) >= new Date(endDate)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      const budgetData = {
        category,
        limit: parseFloat(limit),
        timeline: timeline === 'custom date range' ? 'custom' : timeline.toLowerCase()
      };

      if (timeline === 'custom date range') {
        budgetData.startDate = startDate;
        budgetData.endDate = endDate;
      }

      await createBudget(budgetData);
      setCategory('');
      setLimit('');
      setTimeline('monthly');
      setStartDate('');
      setEndDate('');
      onBudgetAdded();
    } catch (err) {
      setError(err.message || 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-form">
      <h3>Set Budget</h3>
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Timeline</label>
          <select 
            value={timeline} 
            onChange={(e) => setTimeline(e.target.value)}
            required
          >
            {timelines.map(t => (
              <option key={t} value={t.toLowerCase()}>{t}</option>
            ))}
          </select>
        </div>

        {timeline === 'custom date range' && (
          <>
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Budget Limit (₱)</label>
          <input 
            type="number" 
            value={limit} 
            onChange={(e) => setLimit(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Setting...' : 'Set Budget'}
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;

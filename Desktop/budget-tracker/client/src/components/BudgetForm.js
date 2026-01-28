import React, { useState } from 'react';
import { createBudget } from '../utils/api';
import './BudgetForm.css';

const BudgetForm = ({ onBudgetAdded }) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!category || !limit) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await createBudget({
        category,
        limit: parseFloat(limit)
      });
      setCategory('');
      setLimit('');
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

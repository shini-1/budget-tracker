import React, { useState } from 'react';
import { createTransaction } from '../utils/api';
import './TransactionForm.css';

const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    description: '',
    type: 'expense'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
    expense: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: '' }) // Reset category when type changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        description: '',
        type: 'expense'
      });
      onTransactionAdded();
    } catch (err) {
      setError(err.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form">
      <h3>Add Transaction</h3>
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount</label>
            <input 
              type="number" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Description (Optional)</label>
          <input 
            type="text" 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            placeholder="Add a note about this transaction"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;

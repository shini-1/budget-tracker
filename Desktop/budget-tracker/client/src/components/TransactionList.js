import React, { useState } from 'react';
import { deleteTransaction } from '../utils/api';
import './TransactionList.css';

const TransactionList = ({ transactions, onTransactionDeleted }) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      setDeleting(id);
      await deleteTransaction(id);
      onTransactionDeleted();
    } catch (error) {
      alert('Failed to delete transaction: ' + error.message);
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="transaction-list">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id} className={`transaction-row ${transaction.type}`}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.description || '-'}</td>
              <td><span className="category-badge">{transaction.category}</span></td>
              <td>
                <span className={`type-badge ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                </span>
              </td>
              <td className={`amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}₱{transaction.amount.toFixed(2)}
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(transaction._id)}
                  disabled={deleting === transaction._id}
                  title="Delete transaction"
                >
                  {deleting === transaction._id ? '...' : '×'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;

import React, { useEffect, useState } from 'react';
import { getDashboard, getBudgets, getTransactions, getServerTime } from '../utils/api';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import BudgetCalendar from './BudgetCalendar';
import IncomeExpenseChart from './IncomeExpenseChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import SpendingTrendsChart from './SpendingTrendsChart';
import './Dashboard.css';

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    // Sync with server time on component mount
    getServerTime();
    fetchDashboardData();
  }, [refreshKey]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const dashData = await getDashboard();
      setBalance(dashData.balance);
      setTotalIncome(dashData.totalIncome);
      setTotalExpense(dashData.totalExpense);
      setRecentTransactions(dashData.recentTransactions);
      
      const budgetData = await getBudgets();
      console.log('Budgets loaded:', budgetData);
      setBudgets(budgetData);

      const transactionData = await getTransactions();
      setAllTransactions(transactionData);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleBudgetAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading && refreshKey === 0) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      {error && <div className="error-alert">{error}</div>}

      <div className="summary-cards">
        <div className="card balance-card">
          <h3>Total Balance</h3>
          <p className="amount">₱{balance.toFixed(2)}</p>
        </div>
        <div className="card income-card">
          <h3>Total Income</h3>
          <p className="amount income">₱{totalIncome.toFixed(2)}</p>
        </div>
        <div className="card expense-card">
          <h3>Total Expense</h3>
          <p className="amount expense">₱{totalExpense.toFixed(2)}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="left-column">
          <div className="transaction-form-section">
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </div>

          <div className="budget-form-section">
            <BudgetForm onBudgetAdded={handleBudgetAdded} />
          </div>
        </div>

        <div className="right-column">
          <div className="budget-calendar-section">
            <BudgetCalendar budgets={budgets} />
          </div>

          <div className="charts-grid">
            <div className="chart-wrapper">
              <IncomeExpenseChart 
                totalIncome={totalIncome} 
                totalExpense={totalExpense} 
              />
            </div>
            <div className="chart-wrapper">
              <CategoryBreakdownChart transactions={allTransactions} />
            </div>
          </div>

          <div className="trends-chart-wrapper">
            <SpendingTrendsChart transactions={allTransactions} />
          </div>

          <div className="recent-transactions-section">
            <h3>Recent Transactions</h3>
            {recentTransactions.length > 0 ? (
              <TransactionList 
                transactions={recentTransactions} 
                onTransactionDeleted={handleTransactionAdded}
              />
            ) : (
              <p className="no-transactions">No transactions yet. Add your first transaction!</p>
            )}
          </div>

          <div className="budgets-section">
            <h3>Budgets</h3>
            <BudgetList 
              budgets={budgets}
              onBudgetDeleted={handleBudgetAdded}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

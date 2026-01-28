const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

// Dashboard API calls
export const getDashboard = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch dashboard data');
  return response.json();
};

// Transaction API calls
export const getTransactions = async () => {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
};

export const createTransaction = async (transactionData) => {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData)
  });
  if (!response.ok) throw new Error('Failed to create transaction');
  return response.json();
};

export const updateTransaction = async (id, transactionData) => {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData)
  });
  if (!response.ok) throw new Error('Failed to update transaction');
  return response.json();
};

export const deleteTransaction = async (id) => {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete transaction');
  return response.json();
};

// Budget API calls
export const getBudgets = async () => {
  const response = await fetch(`${API_BASE_URL}/budgets`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch budgets');
  return response.json();
};

export const createBudget = async (budgetData) => {
  const response = await fetch(`${API_BASE_URL}/budgets`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData)
  });
  if (!response.ok) throw new Error('Failed to create budget');
  return response.json();
};

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const [isSignup, setIsSignup] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  if (!isAuthenticated) {
    return isSignup ? (
      <Signup onSwitchToLogin={() => setIsSignup(false)} />
    ) : (
      <Login onSwitchToSignup={() => setIsSignup(true)} />
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>Budget Tracker</h1>
        <div className="navbar-right">
          {user && user.name && <span className="user-name">Welcome, {user.name}!</span>}
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

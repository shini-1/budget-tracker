import React, { useState, useEffect } from 'react';
import './BudgetCalendar.css';

const BudgetCalendar = ({ budgets = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysWithBudgets, setDaysWithBudgets] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      calculateBudgetsPerDay();
    } catch (err) {
      console.error('Error calculating budgets per day:', err);
      setError(err.message);
    }
  }, [budgets, currentMonth]);

  const calculateBudgetsPerDay = () => {
    const budgetsByDay = {};
    
    if (!budgets || budgets.length === 0) {
      setDaysWithBudgets(budgetsByDay);
      return;
    }

    budgets.forEach(budget => {
      try {
        const timeline = budget.timeline || 'monthly';
        
        if (timeline === 'daily') {
          // Daily budgets apply to every day
          for (let day = 1; day <= 31; day++) {
            const dateKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (!budgetsByDay[dateKey]) budgetsByDay[dateKey] = [];
            budgetsByDay[dateKey].push(budget);
          }
        } else if (timeline === 'custom' && budget.startDate && budget.endDate) {
          // Custom date range
          try {
            const start = new Date(budget.startDate);
            const end = new Date(budget.endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
              if (!budgetsByDay[dateKey]) budgetsByDay[dateKey] = [];
              budgetsByDay[dateKey].push(budget);
            }
          } catch (err) {
            console.error('Error processing custom date range:', err);
          }
        } else if (timeline === 'weekly') {
          // Weekly budgets - apply to all Mondays
          for (let day = 1; day <= 31; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            if (date.getDay() === 1) { // Monday = 1
              const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              if (!budgetsByDay[dateKey]) budgetsByDay[dateKey] = [];
              budgetsByDay[dateKey].push(budget);
            }
          }
        } else if (timeline === 'monthly' || !timeline) {
          // Monthly budget applies to first day of month
          const dateKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-01`;
          if (!budgetsByDay[dateKey]) budgetsByDay[dateKey] = [];
          budgetsByDay[dateKey].push(budget);
        } else if (timeline === 'yearly') {
          // Yearly budget applies to Jan 1st
          const dateKey = `${currentMonth.getFullYear()}-01-01`;
          if (!budgetsByDay[dateKey]) budgetsByDay[dateKey] = [];
          budgetsByDay[dateKey].push(budget);
        }
      } catch (err) {
        console.error('Error processing budget:', budget, err);
      }
    });

    setDaysWithBudgets(budgetsByDay);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  try {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const today = getTodayDate();

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (error) {
      return (
        <div className="budget-calendar">
          <div className="calendar-error">Error loading calendar: {error}</div>
        </div>
      );
    }

    return (
      <div className="budget-calendar">
        <div className="calendar-header">
          <h3>Budget Calendar</h3>
          <div className="calendar-nav">
            <button onClick={handlePrevMonth} className="nav-btn">←</button>
            <span className="month-year">{monthName}</span>
            <button onClick={handleNextMonth} className="nav-btn">→</button>
          </div>
        </div>

        <div className="calendar-weekdays">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
        </div>

        <div className="calendar-days">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="calendar-day empty"></div>;
            }

            const dateKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayBudgets = daysWithBudgets[dateKey] || [];
            const totalBudget = dayBudgets.reduce((sum, b) => sum + (b.limit || 0), 0);
            const isToday = dateKey === today;

            return (
              <div 
                key={day} 
                className={`calendar-day ${isToday ? 'today' : ''} ${dayBudgets.length > 0 ? 'has-budget' : ''}`}
              >
                <div className="day-number">{day}</div>
                {dayBudgets.length > 0 && (
                  <div className="day-budget">
                    <div className="budget-count">{dayBudgets.length} budget(s)</div>
                    <div className="budget-total">₱{totalBudget.toFixed(0)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch (err) {
    console.error('Error rendering BudgetCalendar:', err);
    return (
      <div className="budget-calendar">
        <div className="calendar-error">Failed to render calendar: {err.message}</div>
      </div>
    );
  }
};

export default BudgetCalendar;

# Budget Tracker Application

## Project Overview
This plan outlines the design and development of a simple, user-friendly web-based budget tracker application. The app will enable users to track personal finances through income/expense logging, categorization, basic reporting, and budget goal setting. It will feature a clean, responsive interface optimized for mobile and desktop, with secure data persistence.

## Tech Stack
- **Front-End**: React.js (with hooks for state management), Tailwind CSS for styling, Axios for API calls, Chart.js for data visualization.
- **Back-End**: Node.js with Express.js, JWT for authentication, Mongoose for MongoDB integration.
- **Database**: MongoDB (flexible for user data and transactions).
- **Other Tools**: Git for version control, Vercel for front-end deployment, Heroku for back-end deployment.

## Project Structure
```
budget-tracker/
├── client/          # React front-end
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── server/          # Node.js back-end
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
└── README.md
```

## Key Features Implementation

### 1. User Authentication
- **Front-End**: Login/signup forms with email/password validation. Use React hooks for form state.
- **Back-End**: JWT-based auth with password hashing (bcrypt). Include password reset via email (using nodemailer).
- **Sample Code (Back-End - User Model)**:
  ```javascript
  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');

  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    resetToken: String,
    resetTokenExpiry: Date
  });

  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

  module.exports = mongoose.model('User', userSchema);
  ```

### 2. Dashboard
- Display total balance, recent transactions, monthly income/expenses summary.
- **Sample Code (Front-End - Dashboard Component)**:
  ```jsx
  import React, { useEffect, useState } from 'react';
  import axios from 'axios';

  const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/dashboard', { headers: { Authorization: token } });
        setBalance(res.data.balance);
        setTransactions(res.data.recentTransactions);
      };
      fetchData();
    }, []);

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Total Balance: ${balance}</p>
        <ul>
          {transactions.map(t => <li key={t._id}>{t.description}: ${t.amount}</li>)}
        </ul>
      </div>
    );
  };

  export default Dashboard;
  ```

### 3. Transaction Management
- CRUD operations for transactions (date, amount, category, description, type).
- **Sample Code (Back-End - Transaction Route)**:
  ```javascript
  const express = require('express');
  const Transaction = require('../models/Transaction');
  const auth = require('../middleware/auth');

  const router = express.Router();

  router.post('/', auth, async (req, res) => {
    const { date, amount, category, description, type } = req.body;
    const transaction = new Transaction({ user: req.user.id, date, amount, category, description, type });
    await transaction.save();
    res.status(201).json(transaction);
  });

  // Add GET, PUT, DELETE routes similarly

  module.exports = router;
  ```

### 4. Categorization
- Predefined categories (e.g., Food, Rent) with icons. Allow user-defined categories.
- **Sample Categories**: Food 🍔, Rent 🏠, Salary 💼, etc.

### 5. Reports and Analytics
- Pie charts for expenses by category, line graphs for monthly trends.
- **Sample Code (Front-End - Reports Component)**:
  ```jsx
  import React from 'react';
  import { Pie } from 'react-chartjs-2';

  const Reports = ({ data }) => {
    const chartData = {
      labels: data.categories,
      datasets: [{ data: data.amounts, backgroundColor: ['#FF6384', '#36A2EB'] }]
    };

    return <Pie data={chartData} />;
  };

  export default Reports;
  ```

### 6. Budget Goals
- Set monthly budgets per category, show progress with alerts.
- **Sample Code (Back-End - Budget Model)**:
  ```javascript
  const budgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: String,
    limit: Number,
    month: String
  });

  module.exports = mongoose.model('Budget', budgetSchema);
  ```

### 7. Data Persistence and Export
- Store in MongoDB. Export transactions to CSV.
- **Sample Export Logic**: Use `json2csv` library in back-end to generate CSV.

### 8. Responsive Design
- Use Tailwind CSS classes like `md:flex` for responsiveness.

## Wireframes (Text-Based Descriptions)
- **Login Page**: Centered form with email/password fields, "Sign Up" link.
- **Dashboard**: Header with balance, sidebar for navigation, main area with transaction list and charts.
- **Add Transaction**: Modal/form with fields for date, amount, category dropdown, description, type radio buttons.

## Sample User Flow
1. User signs up/logs in.
2. Redirected to dashboard showing balance and recent transactions.
3. User adds a transaction via "Add" button.
4. Views reports to see spending breakdown.
5. Sets budget goals and receives alerts if exceeded.

## Potential Challenges
- Handling JWT token expiration and refresh.
- Optimizing chart rendering for large datasets.
- Ensuring data security with input validation and HTTPS.
- Mobile responsiveness testing across devices.

## Deployment Instructions
1. Front-End: Deploy to Vercel by connecting GitHub repo and running `npm run build`.
2. Back-End: Deploy to Heroku with `heroku create`, push code, set environment variables (e.g., MONGO_URI, JWT_SECRET).
3. Database: Use MongoDB Atlas for cloud hosting.

## Implementation Steps
1. Set up project structure with `npx create-react-app client` and `mkdir server`.
2. Implement auth (models, routes, front-end forms).
3. Build transaction CRUD with API integration.
4. Add categorization and reporting with charts.
5. Integrate budget goals and alerts.
6. Polish UI, add responsiveness, test.
7. Deploy and add export features.

Estimated Time: 15-25 hours for basic version.

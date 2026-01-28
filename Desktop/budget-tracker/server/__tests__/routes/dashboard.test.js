const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const dashboardRoutes = require('../../routes/dashboard');

const app = express();
app.use(express.json());
app.use('/api/dashboard', dashboardRoutes);

let authToken;
let testUser;

beforeAll(async () => {
  const mongoURI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/budget-tracker-test';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Transaction.deleteMany({});

  // Create test user
  testUser = new User({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  });
  await testUser.save();

  // Create auth token
  authToken = jwt.sign({ _id: testUser._id }, process.env.JWT_SECRET || 'secretkey');
});

describe('Dashboard Routes', () => {
  describe('GET /api/dashboard', () => {
    it('should return dashboard data with balance and recent transactions', async () => {
      // Create test transactions
      await Transaction.create([
        { user: testUser._id, amount: 2000, type: 'income', category: 'Salary', date: new Date() },
        { user: testUser._id, amount: 500, type: 'expense', category: 'Food', date: new Date() },
        { user: testUser._id, amount: 200, type: 'expense', category: 'Transport', date: new Date() }
      ]);

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('balance');
      expect(response.body).toHaveProperty('totalIncome');
      expect(response.body).toHaveProperty('totalExpense');
      expect(response.body).toHaveProperty('recentTransactions');
    });

    it('should calculate correct balance (income - expense)', async () => {
      await Transaction.create([
        { user: testUser._id, amount: 2000, type: 'income', category: 'Salary', date: new Date() },
        { user: testUser._id, amount: 500, type: 'expense', category: 'Food', date: new Date() },
        { user: testUser._id, amount: 200, type: 'expense', category: 'Transport', date: new Date() }
      ]);

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalIncome).toBe(2000);
      expect(response.body.totalExpense).toBe(700);
      expect(response.body.balance).toBe(1300);
    });

    it('should return up to 10 recent transactions', async () => {
      // Create 15 transactions
      const transactions = [];
      for (let i = 0; i < 15; i++) {
        transactions.push({
          user: testUser._id,
          amount: 100,
          type: i % 2 === 0 ? 'income' : 'expense',
          category: 'Test',
          date: new Date(Date.now() - i * 1000 * 60 * 60)
        });
      }
      await Transaction.create(transactions);

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.recentTransactions.length).toBeLessThanOrEqual(10);
    });

    it('should return zero values when no transactions exist', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.balance).toBe(0);
      expect(response.body.totalIncome).toBe(0);
      expect(response.body.totalExpense).toBe(0);
      expect(response.body.recentTransactions).toEqual([]);
    });

    it('should only show data for authenticated user', async () => {
      // Create another user
      const otherUser = new User({
        email: 'other@example.com',
        password: 'password123',
        name: 'Other User'
      });
      await otherUser.save();

      // Create transactions for both users
      await Transaction.create([
        { user: testUser._id, amount: 2000, type: 'income', category: 'Salary', date: new Date() },
        { user: otherUser._id, amount: 5000, type: 'income', category: 'Salary', date: new Date() }
      ]);

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalIncome).toBe(2000);
      expect(response.body.recentTransactions[0].user.toString()).toBe(testUser._id.toString());
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/dashboard');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle multiple income and expense transactions correctly', async () => {
      await Transaction.create([
        { user: testUser._id, amount: 2000, type: 'income', category: 'Salary', date: new Date() },
        { user: testUser._id, amount: 1000, type: 'income', category: 'Bonus', date: new Date() },
        { user: testUser._id, amount: 500, type: 'expense', category: 'Food', date: new Date() },
        { user: testUser._id, amount: 200, type: 'expense', category: 'Transport', date: new Date() },
        { user: testUser._id, amount: 300, type: 'expense', category: 'Entertainment', date: new Date() }
      ]);

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalIncome).toBe(3000);
      expect(response.body.totalExpense).toBe(1000);
      expect(response.body.balance).toBe(2000);
    });
  });
});

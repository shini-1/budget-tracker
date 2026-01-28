const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const transactionRoutes = require('../../routes/transactions');

const app = express();
app.use(express.json());
app.use('/api/transactions', transactionRoutes);

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

describe('Transaction Routes', () => {
  describe('GET /api/transactions', () => {
    it('should get all transactions for authenticated user', async () => {
      // Create test transactions
      await Transaction.create([
        { user: testUser._id, date: new Date(), amount: 100, category: 'Food', type: 'expense' },
        { user: testUser._id, date: new Date(), amount: 50, category: 'Food', type: 'expense' }
      ]);

      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should return empty array when no transactions exist', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/transactions');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should only return transactions for current user', async () => {
      // Create another user
      const otherUser = new User({
        email: 'other@example.com',
        password: 'password123',
        name: 'Other User'
      });
      await otherUser.save();

      // Create transactions for both users
      await Transaction.create([
        { user: testUser._id, date: new Date(), amount: 100, category: 'Food', type: 'expense' },
        { user: otherUser._id, date: new Date(), amount: 200, category: 'Food', type: 'expense' }
      ]);

      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].user.toString()).toBe(testUser._id.toString());
    });
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const transactionData = {
        date: new Date(),
        amount: 100,
        category: 'Food',
        description: 'Dinner',
        type: 'expense'
      };

      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.amount).toBe(100);
      expect(response.body.category).toBe('Food');
      expect(response.body.type).toBe('expense');
    });

    it('should create income transaction', async () => {
      const transactionData = {
        date: new Date(),
        amount: 2000,
        category: 'Salary',
        description: 'Monthly salary',
        type: 'income'
      };

      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionData);

      expect(response.status).toBe(201);
      expect(response.body.type).toBe('income');
    });

    it('should reject transaction without required fields', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 100
          // missing date, category, type
        });

      expect(response.status).toBe(400);
    });

    it('should reject unauthenticated transaction creation', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .send({
          date: new Date(),
          amount: 100,
          category: 'Food',
          type: 'expense'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/transactions/:id', () => {
    let transactionId;

    beforeEach(async () => {
      const transaction = await Transaction.create({
        user: testUser._id,
        date: new Date(),
        amount: 100,
        category: 'Food',
        type: 'expense'
      });
      transactionId = transaction._id;
    });

    it('should update a transaction', async () => {
      const response = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 150,
          category: 'Restaurant'
        });

      expect(response.status).toBe(200);
      expect(response.body.amount).toBe(150);
      expect(response.body.category).toBe('Restaurant');
    });

    it('should return 404 for non-existent transaction', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/transactions/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 200 });

      expect(response.status).toBe(404);
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .send({ amount: 200 });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    let transactionId;

    beforeEach(async () => {
      const transaction = await Transaction.create({
        user: testUser._id,
        date: new Date(),
        amount: 100,
        category: 'Food',
        type: 'expense'
      });
      transactionId = transaction._id;
    });

    it('should delete a transaction', async () => {
      const response = await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify deletion
      const deleted = await Transaction.findById(transactionId);
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent transaction', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/transactions/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should reject delete without authentication', async () => {
      const response = await request(app)
        .delete(`/api/transactions/${transactionId}`);

      expect(response.status).toBe(401);
    });
  });
});

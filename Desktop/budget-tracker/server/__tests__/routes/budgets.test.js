const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Budget = require('../../models/Budget');
const Transaction = require('../../models/Transaction');
const budgetRoutes = require('../../routes/budgets');

const app = express();
app.use(express.json());
app.use('/api/budgets', budgetRoutes);

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
  await Budget.deleteMany({});
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

describe('Budget Routes', () => {
  describe('GET /api/budgets', () => {
    it('should get all budgets for current month', async () => {
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

      await Budget.create([
        { user: testUser._id, category: 'Food', limit: 500, month: currentMonth },
        { user: testUser._id, category: 'Transport', limit: 200, month: currentMonth }
      ]);

      const response = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should enrich budgets with spent amount', async () => {
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

      // Create budget
      await Budget.create({
        user: testUser._id,
        category: 'Food',
        limit: 500,
        month: currentMonth
      });

      // Create transactions
      await Transaction.create([
        { user: testUser._id, amount: 100, category: 'Food', type: 'expense', date: new Date() },
        { user: testUser._id, amount: 50, category: 'Food', type: 'expense', date: new Date() }
      ]);

      const response = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('spent');
      expect(response.body[0].spent).toBe(150);
    });

    it('should return empty array when no budgets exist', async () => {
      const response = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/budgets');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/budgets', () => {
    it('should create a new budget', async () => {
      const budgetData = {
        category: 'Food',
        limit: 500
      };

      const response = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(budgetData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.category).toBe('Food');
      expect(response.body.limit).toBe(500);
      expect(response.body).toHaveProperty('month');
    });

    it('should set month to current month', async () => {
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

      const response = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 'Transport',
          limit: 200
        });

      expect(response.status).toBe(201);
      expect(response.body.month).toBe(currentMonth);
    });

    it('should reject budget without required fields', async () => {
      const response = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 'Food'
          // missing limit
        });

      expect(response.status).toBe(400);
    });

    it('should reject unauthenticated budget creation', async () => {
      const response = await request(app)
        .post('/api/budgets')
        .send({
          category: 'Food',
          limit: 500
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/budgets/:id', () => {
    let budgetId;

    beforeEach(async () => {
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

      const budget = await Budget.create({
        user: testUser._id,
        category: 'Food',
        limit: 500,
        month: currentMonth
      });
      budgetId = budget._id;
    });

    it('should update a budget limit', async () => {
      const response = await request(app)
        .put(`/api/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ limit: 600 });

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(600);
    });

    it('should return 404 for non-existent budget', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/budgets/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ limit: 600 });

      expect(response.status).toBe(404);
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .put(`/api/budgets/${budgetId}`)
        .send({ limit: 600 });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/budgets/:id', () => {
    let budgetId;

    beforeEach(async () => {
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

      const budget = await Budget.create({
        user: testUser._id,
        category: 'Food',
        limit: 500,
        month: currentMonth
      });
      budgetId = budget._id;
    });

    it('should delete a budget', async () => {
      const response = await request(app)
        .delete(`/api/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify deletion
      const deleted = await Budget.findById(budgetId);
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent budget', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/budgets/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should reject delete without authentication', async () => {
      const response = await request(app)
        .delete(`/api/budgets/${budgetId}`);

      expect(response.status).toBe(401);
    });
  });
});

const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { truncateDatabase, generateToken, createTestUser, createTestTrip, createTestActivity, createTestExpense } = require('./helpers/testHelper');

let user, token, trip, activity, expense;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  user = await createTestUser();
  token = generateToken({ id: user.id, email: user.email });
  trip = await createTestTrip(user.id);
  activity = await createTestActivity(trip.id);
  expense = await createTestExpense(trip.id, activity.id);
});

afterEach(async () => {
  await truncateDatabase();
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/expenses/trip/:tripId', () => {
  test('should get all expenses for a trip', async () => {
    const response = await request(app)
      .get(`/api/expenses/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Expenses retrieved successfully');
    expect(response.body.data).toHaveProperty('expenses');
    expect(response.body.data).toHaveProperty('summary');
    expect(Array.isArray(response.body.data.expenses)).toBe(true);
  });

  test('should filter expenses by category', async () => {
    const response = await request(app)
      .get(`/api/expenses/trip/${trip.id}?category=food`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.expenses.every(e => e.category === 'food')).toBe(true);
  });

  test('should filter expenses by date range', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);

    const response = await request(app)
      .get(`/api/expenses/trip/${trip.id}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.expenses.length).toBeGreaterThanOrEqual(1);
  });

  test('should include expense summary', async () => {
    const response = await request(app)
      .get(`/api/expenses/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.summary).toHaveProperty('total');
    expect(response.body.data.summary).toHaveProperty('byCategory');
    expect(response.body.data.summary).toHaveProperty('count');
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .get('/api/expenses/trip/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/api/expenses/trip/${trip.id}`);

    expect(response.status).toBe(401);
  });
});

describe('GET /api/expenses/:id', () => {
  test('should get expense by id', async () => {
    const response = await request(app)
      .get(`/api/expenses/${expense.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Expense retrieved successfully');
    expect(response.body.data).toHaveProperty('id', expense.id);
  });

  test('should fail when expense not found', async () => {
    const response = await request(app)
      .get('/api/expenses/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/api/expenses/${expense.id}`);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/expenses/trip/:tripId', () => {
  test('should create a new expense', async () => {
    const response = await request(app)
      .post(`/api/expenses/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        activityId: activity.id,
        amount: 75000,
        category: 'transportation',
        description: 'Taxi fare',
        date: new Date()
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Expense created successfully');
    expect(response.body.data).toHaveProperty('amount', 75000);
  });

  test('should create expense without activity', async () => {
    const response = await request(app)
      .post(`/api/expenses/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 75000,
        category: 'transportation',
        description: 'Taxi fare'
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('activityId', null);
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .post('/api/expenses/trip/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 75000,
        category: 'transportation'
      });

    expect(response.status).toBe(404);
  });

  test('should fail when activity not found', async () => {
    const response = await request(app)
      .post(`/api/expenses/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        activityId: '00000000-0000-0000-0000-000000000000',
        amount: 75000,
        category: 'transport'
      });

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post(`/api/expenses/trip/${trip.id}`)
      .send({
        amount: 75000,
        category: 'transportation'
      });

    expect(response.status).toBe(401);
  });

  test('should fail with invalid category', async () => {
    const response = await request(app)
      .post(`/api/expenses/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 75000,
        category: 'invalid_category',
        description: 'Test expense'
      });

    expect(response.status).toBe(400);
  });

  test('should fail with negative amount', async () => {
    const response = await request(app)
      .post(`/api/expenses/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: -100,
        category: 'transportation',
        description: 'Test expense'
      });

    expect(response.status).toBe(400);
  });

  test('should fail without required fields', async () => {
    const response = await request(app)
      .post(`/api/expenses/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Test expense'
      });

    expect(response.status).toBe(400);
  });
});

describe('PUT /api/expenses/:id', () => {
  test('should update expense', async () => {
    const response = await request(app)
      .put(`/api/expenses/${expense.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 100000,
        description: 'Updated lunch'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Expense updated successfully');
    expect(response.body.data).toHaveProperty('amount', 100000);
  });

  test('should fail when expense not found', async () => {
    const response = await request(app)
      .put('/api/expenses/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 100000
      });

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .put(`/api/expenses/${expense.id}`)
      .send({
        amount: 100000
      });

    expect(response.status).toBe(401);
  });

  test('should fail with invalid category', async () => {
    const response = await request(app)
      .put(`/api/expenses/${expense.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        category: 'invalid_category'
      });

    expect(response.status).toBe(400);
  });

  test('should fail with negative amount', async () => {
    const response = await request(app)
      .put(`/api/expenses/${expense.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: -100
      });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/expenses/:id', () => {
  test('should delete expense', async () => {
    const response = await request(app)
      .delete(`/api/expenses/${expense.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Expense deleted successfully');
  });

  test('should fail when expense not found', async () => {
    const response = await request(app)
      .delete('/api/expenses/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .delete(`/api/expenses/${expense.id}`);

    expect(response.status).toBe(401);
  });
});

describe('GET /api/expenses/trip/:tripId/stats', () => {
  test('should get expense statistics', async () => {
    const response = await request(app)
      .get(`/api/expenses/trip/${trip.id}/stats`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Expense statistics retrieved successfully');
    expect(response.body.data).toHaveProperty('total');
    expect(response.body.data).toHaveProperty('budget');
    expect(response.body.data).toHaveProperty('remaining');
    expect(response.body.data).toHaveProperty('percentageUsed');
    expect(response.body.data).toHaveProperty('byCategory');
    expect(response.body.data).toHaveProperty('dailyExpenses');
    expect(response.body.data).toHaveProperty('count');
    expect(response.body.data).toHaveProperty('averagePerDay');
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .get('/api/expenses/trip/00000000-0000-0000-0000-000000000000/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/api/expenses/trip/${trip.id}/stats`);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/expenses/trip/:tripId/bulk', () => {
  test('should bulk create expenses', async () => {
    const response = await request(app)
      .post(`/api/expenses/trip/${trip.id}/bulk`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        expenses: [
          {
            amount: 30000,
            category: 'food',
            description: 'Breakfast',
            date: new Date()
          },
          {
            amount: 45000,
            category: 'food',
            description: 'Dinner',
            date: new Date()
          }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Expenses created successfully');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .post('/api/expenses/trip/00000000-0000-0000-0000-000000000000/bulk')
      .set('Authorization', `Bearer ${token}`)
      .send({
        expenses: [{ amount: 30000, category: 'food' }]
      });

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post(`/api/expenses/trip/${trip.id}/bulk`)
      .send({
        expenses: [{ amount: 30000, category: 'food' }]
      });

    expect(response.status).toBe(401);
  });
});

const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { truncateDatabase, generateToken, createTestUser, createTestTrip, createTestActivity, createTestExpense } = require('./helpers/testHelper');

let user, token, trip;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  user = await createTestUser();
  token = generateToken({ id: user.id, email: user.email });
  trip = await createTestTrip(user.id);
});

afterEach(async () => {
  await truncateDatabase();
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/trips', () => {
  test('should get all trips for authenticated user', async () => {
    const response = await request(app)
      .get('/api/trips')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Trips retrieved successfully');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
  });

  test('should filter trips by status', async () => {
    await createTestTrip(user.id);

    const response = await request(app)
      .get('/api/trips?status=draft')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.every(t => t.status === 'draft')).toBe(true);
  });

  test('should search trips by title or destination', async () => {
    const response = await request(app)
      .get('/api/trips?search=Bali')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .get('/api/trips');

    expect(response.status).toBe(401);
  });
});

describe('GET /api/trips/:id', () => {
  test('should get trip by id', async () => {
    const response = await request(app)
      .get(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', trip.id);
    expect(response.body.data).toHaveProperty('title', 'Test Trip');
  });

  test('should include activities and expenses', async () => {
    await createTestActivity(trip.id);
    await createTestExpense(trip.id);

    const response = await request(app)
      .get(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('activities');
    expect(response.body.data).toHaveProperty('expenses');
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .get('/api/trips/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/api/trips/${trip.id}`);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/trips', () => {
  test('should create a new trip', async () => {
    const response = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Trip',
        destination: 'Tokyo',
        departureLocation: 'Jakarta',
        startDate: '2025-12-10',
        endDate: '2025-12-15',
        budget: 20000000,
        status: 'draft'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Trip created successfully');
    expect(response.body.data).toHaveProperty('title', 'New Trip');
  });

  test('should create trip with default status', async () => {
    const response = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Trip',
        destination: 'Tokyo',
        departureLocation: 'Jakarta',
        startDate: '2025-12-10',
        endDate: '2025-12-15',
        budget: 20000000
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('status', 'draft');
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post('/api/trips')
      .send({
        title: 'New Trip',
        destination: 'Tokyo'
      });

    expect(response.status).toBe(401);
  });

  test('should fail with invalid status', async () => {
    const response = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Trip',
        destination: 'Tokyo',
        departureLocation: 'Jakarta',
        startDate: '2025-12-10',
        endDate: '2025-12-15',
        budget: 20000000,
        status: 'invalid_status'
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message');
  });

  test('should fail without required fields', async () => {
    const response = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Just a description'
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message');
  });
});

describe('PUT /api/trips/:id', () => {
  test('should update trip', async () => {
    const response = await request(app)
      .put(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Trip',
        status: 'confirmed'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Trip updated successfully');
    expect(response.body.data).toHaveProperty('title', 'Updated Trip');
    expect(response.body.data).toHaveProperty('status', 'confirmed');
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .put('/api/trips/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Trip'
      });

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .put(`/api/trips/${trip.id}`)
      .send({
        title: 'Updated Trip'
      });

    expect(response.status).toBe(401);
  });
});

describe('DELETE /api/trips/:id', () => {
  test('should delete trip', async () => {
    const response = await request(app)
      .delete(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Trip deleted successfully');
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .delete('/api/trips/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .delete(`/api/trips/${trip.id}`);

    expect(response.status).toBe(401);
  });
});

describe('GET /api/trips/stats', () => {
  test('should get trip statistics', async () => {
    await createTestActivity(trip.id);
    await createTestExpense(trip.id);

    const response = await request(app)
      .get('/api/trips/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Stats retrieved successfully');
    expect(response.body.data).toHaveProperty('totalTrips');
    expect(response.body.data).toHaveProperty('draftTrips');
    expect(response.body.data).toHaveProperty('confirmedTrips');
    expect(response.body.data).toHaveProperty('completedTrips');
    expect(response.body.data).toHaveProperty('totalBudget');
    expect(response.body.data).toHaveProperty('totalActivities');
    expect(response.body.data).toHaveProperty('totalExpenses');
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .get('/api/trips/stats');

    expect(response.status).toBe(401);
  });
});

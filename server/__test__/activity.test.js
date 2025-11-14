const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { truncateDatabase, generateToken, createTestUser, createTestTrip, createTestActivity } = require('./helpers/testHelper');

let user, token, trip, activity;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  user = await createTestUser();
  token = generateToken({ id: user.id, email: user.email });
  trip = await createTestTrip(user.id);
  activity = await createTestActivity(trip.id);
});

afterEach(async () => {
  await truncateDatabase();
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/activities/trip/:tripId', () => {
  test('should get all activities for a trip', async () => {
    const response = await request(app)
      .get(`/api/activities/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Activities retrieved successfully');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .get('/api/activities/trip/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/api/activities/trip/${trip.id}`);

    expect(response.status).toBe(401);
  });
});

describe('GET /api/activities/:id', () => {
  test('should get activity by id', async () => {
    const response = await request(app)
      .get(`/api/activities/${activity.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Activity retrieved successfully');
    expect(response.body.data).toHaveProperty('id', activity.id);
    expect(response.body.data).toHaveProperty('title', 'Visit Temple');
  });

  test('should fail when activity not found', async () => {
    const response = await request(app)
      .get('/api/activities/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/api/activities/${activity.id}`);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/activities/trip/:tripId', () => {
  test('should create a new activity', async () => {
    const response = await request(app)
      .post(`/api/activities/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        day: 1,
        title: 'Beach Day',
        description: 'Relax at the beach',
        location: 'Seminyak Beach',
        startTime: '14:00',
        endTime: '18:00',
        category: 'activity',
        cost: 0,
        order: 1
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Activity created successfully');
    expect(response.body.data).toHaveProperty('title', 'Beach Day');
  });

  test('should create activity with default order', async () => {
    const response = await request(app)
      .post(`/api/activities/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        day: 1,
        title: 'Beach Day',
        category: 'activity'
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('order', 0);
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .post('/api/activities/trip/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({
        day: 1,
        title: 'Beach Day',
        category: 'activity'
      });

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post(`/api/activities/trip/${trip.id}`)
      .send({
        day: 1,
        title: 'Beach Day'
      });

    expect(response.status).toBe(401);
  });

  test('should fail with invalid category', async () => {
    const response = await request(app)
      .post(`/api/activities/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        day: 1,
        title: 'Beach Day',
        category: 'invalid_category'
      });

    expect(response.status).toBe(400);
  });

  test('should fail without required fields', async () => {
    const response = await request(app)
      .post(`/api/activities/trip/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Just a description'
      });

    expect(response.status).toBe(400);
  });
});

describe('PUT /api/activities/:id', () => {
  test('should update activity', async () => {
    const response = await request(app)
      .put(`/api/activities/${activity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Activity',
        cost: 200000
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Activity updated successfully');
    expect(response.body.data).toHaveProperty('title', 'Updated Activity');
    expect(response.body.data).toHaveProperty('cost', 200000);
  });

  test('should fail when activity not found', async () => {
    const response = await request(app)
      .put('/api/activities/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Activity'
      });

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .put(`/api/activities/${activity.id}`)
      .send({
        title: 'Updated Activity'
      });

    expect(response.status).toBe(401);
  });
});

describe('DELETE /api/activities/:id', () => {
  test('should delete activity', async () => {
    const response = await request(app)
      .delete(`/api/activities/${activity.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Activity deleted successfully');
  });

  test('should fail when activity not found', async () => {
    const response = await request(app)
      .delete('/api/activities/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .delete(`/api/activities/${activity.id}`);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/activities/trip/:tripId/bulk', () => {
  test('should bulk create activities', async () => {
    const response = await request(app)
      .post(`/api/activities/trip/${trip.id}/bulk`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        activities: [
          {
            day: 2,
            title: 'Morning Hike',
            category: 'activity'
          },
          {
            day: 2,
            title: 'Lunch',
            category: 'food'
          }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Activities created successfully');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  test('should sanitize invalid categories', async () => {
    const response = await request(app)
      .post(`/api/activities/trip/${trip.id}/bulk`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        activities: [
          {
            day: 1,
            title: 'Test',
            category: 'invalid-category'
          }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.data[0]).toHaveProperty('category', 'other');
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .post('/api/activities/trip/00000000-0000-0000-0000-000000000000/bulk')
      .set('Authorization', `Bearer ${token}`)
      .send({
        activities: [{ day: 1, title: 'Test' }]
      });

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post(`/api/activities/trip/${trip.id}/bulk`)
      .send({
        activities: [{ day: 1, title: 'Test' }]
      });

    expect(response.status).toBe(401);
  });
});

describe('POST /api/activities/trip/:tripId/reorder', () => {
  test('should reorder activities', async () => {
    const activity2 = await createTestActivity(trip.id);

    const response = await request(app)
      .post(`/api/activities/trip/${trip.id}/reorder`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        activities: [
          { id: activity.id, order: 1, day: 1 },
          { id: activity2.id, order: 0, day: 1 }
        ]
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Activities reordered successfully');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .post('/api/activities/trip/00000000-0000-0000-0000-000000000000/reorder')
      .set('Authorization', `Bearer ${token}`)
      .send({
        activities: []
      });

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post(`/api/activities/trip/${trip.id}/reorder`)
      .send({
        activities: []
      });

    expect(response.status).toBe(401);
  });
});

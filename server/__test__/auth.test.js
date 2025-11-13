const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { truncateDatabase, generateToken, createTestUser } = require('./helpers/testHelper');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await truncateDatabase();
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/auth/register', () => {
  test('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body.data).toHaveProperty('email', 'john@example.com');
    expect(response.body.data).not.toHaveProperty('password');
  });

  test('should fail when email already exists', async () => {
    await createTestUser();

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(400);
  });

  test('should fail when email is invalid', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      });

    expect(response.status).toBe(400);
  });

  test('should fail when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe'
      });

    expect(response.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  test('should login successfully with valid credentials', async () => {
    await createTestUser();

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('should fail with invalid email', async () => {
    await createTestUser();

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Email or Password is invalid');
  });

  test('should fail with invalid password', async () => {
    await createTestUser();

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
  });

  test('should fail when email is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email or Password is required');
  });

  test('should fail when password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com'
      });

    expect(response.status).toBe(400);
  });
});

describe('GET /api/me', () => {
  test('should get current user info with valid token', async () => {
    const user = await createTestUser();
    const token = generateToken({ id: user.id, email: user.email });

    const response = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User retrieved successfully');
    expect(response.body.data).toHaveProperty('email', 'test@example.com');
    expect(response.body.data).not.toHaveProperty('password');
  });

  test('should fail without token', async () => {
    const response = await request(app)
      .get('/api/me');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Please login first');
  });

  test('should fail with invalid token', async () => {
    const response = await request(app)
      .get('/api/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
  });

  test('should fail when user not found', async () => {
    const token = generateToken({ id: '00000000-0000-0000-0000-000000000000', email: 'nonexistent@example.com' });

    const response = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Please login first');
  });
});

describe('POST /api/auth/google', () => {
  test('should fail without google token', async () => {
    const response = await request(app)
      .post('/api/auth/google');

    expect(response.status).toBe(500); // Google OAuth will fail without proper token
  });

  test('should fail with invalid google token', async () => {
    const response = await request(app)
      .post('/api/auth/google')
      .set('token', 'invalid-google-token');

    expect(response.status).toBe(500); // Google OAuth verification will fail
  });
});

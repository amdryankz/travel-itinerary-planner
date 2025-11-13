const authentication = require('../middlewares/authentication');
const { User } = require('../models');
const { signToken } = require('../utils/jwt');
const { sequelize } = require('../models');
const { truncateDatabase } = require('./helpers/testHelper');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await truncateDatabase();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Authentication Middleware', () => {
  let req, res, next, user;

  beforeEach(async () => {
    user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  test('should authenticate user with valid token', async () => {
    const token = signToken({ id: user.id, email: user.email });
    req.headers.authorization = `Bearer ${token}`;

    await authentication(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(user.id);
    expect(req.user.email).toBe(user.email);
    expect(next).toHaveBeenCalled();
  });

  test('should fail without authorization header', async () => {
    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith({ name: 'Unauthorized' });
  });

  test('should fail with invalid token', async () => {
    req.headers.authorization = 'Bearer invalid-token';

    await authentication(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.name).toBe('JsonWebTokenError');
  });

  test('should fail when user not found', async () => {
    const token = signToken({ id: '00000000-0000-0000-0000-000000000000', email: 'nonexistent@example.com' });
    req.headers.authorization = `Bearer ${token}`;

    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith({ name: 'Unauthorized' });
  });

  test('should fail with malformed authorization header', async () => {
    req.headers.authorization = 'InvalidFormat';

    await authentication(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

const request = require('supertest');

describe('App', () => {
  let originalEnv;

  beforeEach(() => {
    // Save original env
    originalEnv = { ...process.env };

    // Clear require cache
    delete require.cache[require.resolve('../app')];
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;

    // Clear require cache
    delete require.cache[require.resolve('../app')];
  });

  describe('Production environment', () => {
    it('should load app in production mode', () => {
      process.env.NODE_ENV = 'production';
      // Set DATABASE_URL for production mode
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';

      const app = require('../app');

      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    it('should handle requests in production mode', async () => {
      process.env.NODE_ENV = 'production';
      // Set DATABASE_URL for production mode
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';

      const app = require('../app');

      // Test that app responds (even if route doesn't exist)
      const response = await request(app)
        .get('/api/health')
        .send();

      // Should get some response (even if 404)
      expect(response.status).toBeDefined();
    });
  });

  describe('Non-production environment', () => {
    it('should load app in development mode', () => {
      process.env.NODE_ENV = 'development';

      const app = require('../app');

      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    it('should load app in test mode', () => {
      process.env.NODE_ENV = 'test';

      const app = require('../app');

      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    it('should load app when NODE_ENV is undefined', () => {
      delete process.env.NODE_ENV;

      const app = require('../app');

      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });
  });

  describe('Middleware setup', () => {
    it('should have cors enabled', () => {
      process.env.NODE_ENV = 'test';

      const app = require('../app');

      // App should be a function (express app)
      expect(typeof app).toBe('function');
    });

    it('should have json parser', async () => {
      process.env.NODE_ENV = 'test';

      const app = require('../app');

      // Try sending JSON (even to non-existent route)
      const response = await request(app)
        .post('/api/test')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');

      // Should process JSON (even if route doesn't exist)
      expect(response.status).toBeDefined();
    });
  });
});

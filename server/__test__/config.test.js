const path = require('path');

describe('Config', () => {
  let originalEnv;

  beforeEach(() => {
    // Save original env
    originalEnv = { ...process.env };

    // Clear require cache for both config and app
    delete require.cache[require.resolve('../config/config')];
    delete require.cache[require.resolve('../app')];
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;

    // Clear require cache again
    delete require.cache[require.resolve('../config/config')];
    delete require.cache[require.resolve('../app')];
  });

  describe('Non-production environment', () => {
    it('should load config with dotenv in development environment', () => {
      process.env.NODE_ENV = 'development';

      const config = require('../config/config');

      expect(config).toHaveProperty('development');
      expect(config).toHaveProperty('test');
      expect(config).toHaveProperty('production');
      expect(config.development).toHaveProperty('username');
      expect(config.development).toHaveProperty('password');
      expect(config.development).toHaveProperty('database');
    });

    it('should load config with dotenv in test environment', () => {
      process.env.NODE_ENV = 'test';

      const config = require('../config/config');

      expect(config).toHaveProperty('development');
      expect(config).toHaveProperty('test');
      expect(config).toHaveProperty('production');
      expect(config.test).toHaveProperty('username');
      expect(config.test).toHaveProperty('password');
      expect(config.test).toHaveProperty('database');
    });

    it('should load config with dotenv when NODE_ENV is undefined', () => {
      delete process.env.NODE_ENV;

      const config = require('../config/config');

      expect(config).toHaveProperty('development');
      expect(config).toHaveProperty('test');
      expect(config).toHaveProperty('production');
    });
  });

  describe('Production environment', () => {
    it('should load config without dotenv in production environment', () => {
      process.env.NODE_ENV = 'production';

      const config = require('../config/config');

      expect(config).toHaveProperty('production');
      expect(config.production).toHaveProperty('use_env_variable');
      expect(config.production.use_env_variable).toBe('DATABASE_URL');
    });

    it('should have proper config structure for all environments', () => {
      process.env.NODE_ENV = 'production';

      const config = require('../config/config');

      expect(config.development).toHaveProperty('dialect', 'postgres');
      expect(config.test).toHaveProperty('dialect', 'postgres');
      expect(config.development).toHaveProperty('host', '127.0.0.1');
      expect(config.test).toHaveProperty('host', '127.0.0.1');
    });
  });
});

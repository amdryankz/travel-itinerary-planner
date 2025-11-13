const { User } = require('../models');
const bcrypt = require('bcryptjs');

describe('Models', () => {
  describe('Sequelize Connection', () => {
    it('should have sequelize instance', () => {
      const db = require('../models');

      expect(db.sequelize).toBeDefined();
      expect(db.Sequelize).toBeDefined();
    });

    it('should have all models loaded', () => {
      const db = require('../models');

      expect(db.User).toBeDefined();
      expect(db.Trip).toBeDefined();
      expect(db.Activity).toBeDefined();
      expect(db.Expense).toBeDefined();
    });

    it('should initialize with environment config', () => {
      const db = require('../models');

      // Check if connection is established
      expect(db.sequelize.config).toBeDefined();
      expect(db.sequelize.config.database).toBeDefined();
    });
  });
});

describe('User Model', () => {
  afterEach(async () => {
    await User.destroy({ where: {}, force: true });
  });

  describe('beforeCreate hook', () => {
    it('should hash password when password is provided', async () => {
      const plainPassword = 'testPassword123';

      const user = await User.create({
        email: 'test@example.com',
        password: plainPassword,
        name: 'Test User'
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toBeTruthy();

      // Verify password is properly hashed
      const isValidPassword = await bcrypt.compare(plainPassword, user.password);
      expect(isValidPassword).toBe(true);
    });

    it('should not hash password when password is not provided', async () => {
      const user = await User.create({
        email: 'googleuser@example.com',
        name: 'Google User',
        avatar: 'https://example.com/avatar.jpg'
      });

      expect(user.password).toBeNull();
      expect(user.email).toBe('googleuser@example.com');
      expect(user.name).toBe('Google User');
    });

    it('should handle empty password string', async () => {
      const user = await User.create({
        email: 'emptypass@example.com',
        password: '',
        name: 'Empty Pass User'
      });

      // Empty string is falsy, should not be hashed
      expect(user.password).toBe('');
    });
  });

  describe('validations', () => {
    it('should fail with invalid email format', async () => {
      await expect(User.create({
        email: 'invalidemail',
        password: 'password123',
        name: 'Test User'
      })).rejects.toThrow();
    });

    it('should fail with duplicate email', async () => {
      await User.create({
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'User 1'
      });

      await expect(User.create({
        email: 'duplicate@example.com',
        password: 'password456',
        name: 'User 2'
      })).rejects.toThrow();
    });

    it('should fail without email', async () => {
      await expect(User.create({
        password: 'password123',
        name: 'No Email User'
      })).rejects.toThrow();
    });
  });

  describe('user creation', () => {
    it('should create user with all fields', async () => {
      const user = await User.create({
        email: 'fulluser@example.com',
        password: 'password123',
        name: 'Full User',
        avatar: 'https://example.com/avatar.jpg'
      });

      expect(user.email).toBe('fulluser@example.com');
      expect(user.name).toBe('Full User');
      expect(user.avatar).toBe('https://example.com/avatar.jpg');
      expect(user.id).toBeTruthy();
    });

    it('should create user without optional fields', async () => {
      const user = await User.create({
        email: 'minimaluser@example.com',
        password: 'password123'
      });

      expect(user.email).toBe('minimaluser@example.com');
      expect(user.name).toBeNull();
      expect(user.avatar).toBeNull();
    });
  });
});

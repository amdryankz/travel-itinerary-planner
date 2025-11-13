// Jest setup file
// Load environment variables from .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

process.env.NODE_ENV = 'test';

// Set test timeout
jest.setTimeout(30000);

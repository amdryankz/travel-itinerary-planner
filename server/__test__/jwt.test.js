const { signToken, verifyToken } = require('../utils/jwt');

describe('JWT Utilities', () => {
  const payload = {
    id: '12345',
    email: 'test@example.com'
  };

  describe('signToken', () => {
    test('should generate a valid token', () => {
      const token = signToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should generate different tokens for different payloads', () => {
      const token1 = signToken({ id: '1', email: 'user1@example.com' });
      const token2 = signToken({ id: '2', email: 'user2@example.com' });

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    test('should verify and decode a valid token', () => {
      const token = signToken(payload);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded).toHaveProperty('iat'); // issued at
    });

    test('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid-token');
      }).toThrow();
    });

    test('should throw error for malformed token', () => {
      expect(() => {
        verifyToken('malformed.token');
      }).toThrow();
    });

    test('should throw error for empty token', () => {
      expect(() => {
        verifyToken('');
      }).toThrow();
    });
  });

  describe('Token round-trip', () => {
    test('should successfully sign and verify token', () => {
      const originalPayload = {
        id: '123',
        email: 'test@example.com',
        role: 'user'
      };

      const token = signToken(originalPayload);
      const decodedPayload = verifyToken(token);

      expect(decodedPayload.id).toBe(originalPayload.id);
      expect(decodedPayload.email).toBe(originalPayload.email);
      expect(decodedPayload.role).toBe(originalPayload.role);
    });
  });
});

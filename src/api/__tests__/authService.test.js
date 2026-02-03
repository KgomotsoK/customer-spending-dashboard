import { authenticateUser, mockUsers, validateToken } from '../authService';

describe('Auth Service', () => {
  describe('authenticateUser', () => {
    it('should authenticate valid user credentials', async () => {
      const result = await authenticateUser('john.doe@email.co.za', 'John@26');
      
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe('cust_12345');
      expect(result.user.name).toBe('Thabo Mokoena');
      expect(result.user.email).toBe('thabo.mokoena@email.co.za');
      expect(result.user.password).toBeUndefined();
      expect(result.token).toMatch(/^mock_token_cust_12345_/);
    });

    it('should authenticate with case-insensitive email', async () => {
      const result = await authenticateUser('JOHN.DOE@EMAIL.CO.ZA', 'John@26');
      
      expect(result.user.id).toBe('cust_12345');
    });

    it('should reject invalid password', async () => {
      await expect(
        authenticateUser('john.doe@email.co.za', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should reject non-existent email', async () => {
      await expect(
        authenticateUser('nonexistent@email.com', 'John@26')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should authenticate demo user', async () => {
      const result = await authenticateUser('demo@capitec.co.za', 'password');
      
      expect(result.user.name).toBe('Demo User');
      expect(result.user.id).toBe('cust_11111');
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token and return user', () => {
      const token = 'mock_token_cust_12345_1234567890';
      const user = validateToken(token);
      
      expect(user).not.toBeNull();
      if (user) {
        expect(user.id).toBe('cust_12345');
        expect(user.password).toBeUndefined();
      }
    });

    it('should return null for invalid token format', () => {
      expect(validateToken('invalid_token')).toBeNull();
      expect(validateToken('')).toBeNull();
      expect(validateToken(null)).toBeNull();
      expect(validateToken(undefined)).toBeNull();
    });

    it('should return null for non-existent user in token', () => {
      const token = 'mock_token_nonexistent_user_1234567890';
      expect(validateToken(token)).toBeNull();
    });
  });

  describe('mockUsers', () => {
    it('should have at least 3 mock users', () => {
      expect(mockUsers.length).toBeGreaterThanOrEqual(3);
    });

    it('should have required fields for each user', () => {
      mockUsers.forEach(user => {
        expect(user.id).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.password).toBeDefined();
        expect(user.name).toBeDefined();
      });
    });
  });
});

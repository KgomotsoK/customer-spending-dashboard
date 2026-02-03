// src/api/__tests__/authService.test.js
import { apiClient } from '../apiClient';
import { authenticateUser, clearAuthStorage, getCurrentUser, isAuthenticated, storeAuthData } from '../authService';

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: jest.fn(key => localStorageMock.store[key]),
  setItem: jest.fn((key, value) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: jest.fn(key => {
    delete localStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  })
};

global.localStorage = localStorageMock;

// Mock apiClient
jest.mock('../apiClient', () => ({
  apiClient: {
    get: jest.fn()
  }
}));

describe('Auth Service', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('authenticateUser', () => {
    const mockUsers = [
      {
        id: 'cust_12345',
        customerId: 'cust_12345',
        email: 'john.doe@email.co.za',
        password: 'John@26',
        name: 'Thabo Mokoena'
      },
      {
        id: 'cust_11111',
        customerId: 'cust_11111',
        email: 'demo@capitec.co.za',
        password: 'password',
        name: 'Demo User'
      }
    ];

    beforeEach(() => {
      apiClient.get.mockResolvedValue({
        data: mockUsers
      });
    });

    it('should authenticate valid user credentials', async () => {
      const result = await authenticateUser('john.doe@email.co.za', 'John@26');
      
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe('cust_12345');
      expect(result.user.customerId).toBe('cust_12345');
      expect(result.user.name).toBe('Thabo Mokoena');
      expect(result.user.email).toBe('john.doe@email.co.za');
      expect(result.user.password).toBeUndefined();
      expect(result.token).toBeDefined();
      expect(result.expiresIn).toBe(86400); // 24 hours in seconds
    });

    it('should authenticate with case-insensitive email', async () => {
      const result = await authenticateUser('JOHN.DOE@EMAIL.CO.ZA', 'John@26');
      
      expect(result.user.id).toBe('cust_12345');
      expect(apiClient.get).toHaveBeenCalledWith('/customers/customers.json');
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

    it('should handle API errors gracefully', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));
      
      await expect(
        authenticateUser('john.doe@email.co.za', 'John@26')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('getCurrentUser', () => {
    const mockUser = {
      id: 'cust_12345',
      customerId: 'cust_12345',
      name: 'Thabo Mokoena',
      email: 'thabo.mokoena@email.co.za'
    };

    const generateValidToken = () => {
      const tokenData = {
        userId: 'cust_12345',
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
        random: 'abc123',
        timestamp: Date.now()
      };
      return btoa(JSON.stringify(tokenData));
    };

    const generateExpiredToken = () => {
      const tokenData = {
        userId: 'cust_12345',
        expiresAt: Date.now() - (24 * 60 * 60 * 1000), // 24 hours ago
        random: 'abc123',
        timestamp: Date.now()
      };
      return btoa(JSON.stringify(tokenData));
    };

    it('should return user when valid token exists', () => {
      const validToken = generateValidToken();
      localStorage.setItem('spending_insights_token', validToken);
      localStorage.setItem('spending_insights_user', JSON.stringify(mockUser));
      
      const user = getCurrentUser();
      
      expect(user).toEqual(mockUser);
    });

    it('should return null when no token exists', () => {
      localStorage.setItem('spending_insights_user', JSON.stringify(mockUser));
      
      const user = getCurrentUser();
      
      expect(user).toBeNull();
    });

    it('should return null when no user exists', () => {
      const validToken = generateValidToken();
      localStorage.setItem('spending_insights_token', validToken);
      
      const user = getCurrentUser();
      
      expect(user).toBeNull();
    });

    it('should return null for expired token', () => {
      const expiredToken = generateExpiredToken();
      localStorage.setItem('spending_insights_token', expiredToken);
      localStorage.setItem('spending_insights_user', JSON.stringify(mockUser));
      
      const user = getCurrentUser();
      
      expect(user).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('spending_insights_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('spending_insights_user');
    });

    it('should return null when token userId does not match stored user', () => {
      const tokenData = {
        userId: 'different_user_id',
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
        random: 'abc123',
        timestamp: Date.now()
      };
      const token = btoa(JSON.stringify(tokenData));
      
      localStorage.setItem('spending_insights_token', token);
      localStorage.setItem('spending_insights_user', JSON.stringify(mockUser));
      
      const user = getCurrentUser();
      
      expect(user).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('spending_insights_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('spending_insights_user');
    });

    it('should handle malformed token gracefully', () => {
      localStorage.setItem('spending_insights_token', 'invalid_token_format');
      localStorage.setItem('spending_insights_user', JSON.stringify(mockUser));
      
      const user = getCurrentUser();
      
      expect(user).toBeNull();
    });
  });

  describe('storeAuthData', () => {
    const mockUser = { id: 'cust_12345', name: 'Test User' };
    const mockToken = 'test_token';

    it('should store user and token in localStorage', () => {
      storeAuthData(mockUser, mockToken);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('spending_insights_token', mockToken);
      expect(localStorage.setItem).toHaveBeenCalledWith('spending_insights_user', JSON.stringify(mockUser));
    });

    it('should throw error when localStorage fails', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });
      
      expect(() => storeAuthData(mockUser, mockToken)).toThrow('Failed to save authentication data');
    });
  });

  describe('clearAuthStorage', () => {
    it('should remove auth items from localStorage', () => {
      clearAuthStorage();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('spending_insights_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('spending_insights_user');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      const mockUser = { id: 'cust_12345' };
      const validToken = btoa(JSON.stringify({
        userId: 'cust_12345',
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      }));
      
      localStorage.setItem('spending_insights_token', validToken);
      localStorage.setItem('spending_insights_user', JSON.stringify(mockUser));
      
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when no user is authenticated', () => {
      expect(isAuthenticated()).toBe(false);
    });
  });
});
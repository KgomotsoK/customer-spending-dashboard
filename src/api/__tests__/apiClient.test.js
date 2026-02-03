import apiClient, { setCustomerId, getCustomerId } from '../apiClient';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setCustomerId('cust_12345');
  });

  describe('Customer ID Management', () => {
    it('should set and get customer ID', () => {
      setCustomerId('cust_67890');
      expect(getCustomerId()).toBe('cust_67890');
    });

    it('should default to cust_12345', () => {
      setCustomerId('cust_12345');
      expect(getCustomerId()).toBe('cust_12345');
    });
  });

  describe('getCustomerProfile', () => {
    it('should fetch customer profile', async () => {
      const mockProfile = {
        customerId: 'cust_12345',
        name: 'Thabo Mokoena',
        email: 'thabo.mokoena@email.co.za'
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProfile)
      });

      const result = await apiClient.getCustomerProfile();
      
      expect(fetch).toHaveBeenCalledWith('/mock-api/customers/cust_12345/profile.json');
      expect(result).toEqual(mockProfile);
    });

    it('should fallback to default customer on 404', async () => {
      const mockProfile = { name: 'Fallback User' };
      
      global.fetch
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockProfile)
        });

      const result = await apiClient.getCustomerProfile();
      
      expect(result).toEqual(mockProfile);
    });
  });

  describe('getSpendingSummary', () => {
    it('should fetch spending summary for default period', async () => {
      const mockData = {
        '30d': { period: '30d', totalSpent: 32890.25 },
        '7d': { period: '7d', totalSpent: 8245.50 }
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await apiClient.getSpendingSummary();
      
      expect(result).toEqual(mockData['30d']);
    });

    it('should fetch spending summary for specific period', async () => {
      const mockData = {
        '30d': { period: '30d', totalSpent: 32890.25 },
        '7d': { period: '7d', totalSpent: 8245.50 }
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await apiClient.getSpendingSummary('7d');
      
      expect(result).toEqual(mockData['7d']);
    });
  });

  describe('getTransactions', () => {
    const mockTransactions = {
      transactions: [
        { id: 'txn_1', category: 'Groceries', amount: 100, date: '2025-01-15T10:00:00Z' },
        { id: 'txn_2', category: 'Transport', amount: 50, date: '2025-01-14T10:00:00Z' },
        { id: 'txn_3', category: 'Groceries', amount: 200, date: '2025-01-13T10:00:00Z' }
      ]
    };

    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTransactions)
      });
    });

    it('should fetch transactions with pagination', async () => {
      const result = await apiClient.getTransactions({ limit: 2, offset: 0 });
      
      expect(result.transactions).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.hasMore).toBe(true);
    });

    it('should filter by category', async () => {
      const result = await apiClient.getTransactions({ 
        limit: 10, 
        offset: 0, 
        category: 'Groceries' 
      });
      
      expect(result.transactions).toHaveLength(2);
      expect(result.transactions.every(t => t.category === 'Groceries')).toBe(true);
    });

    it('should sort by date descending', async () => {
      const result = await apiClient.getTransactions({ 
        limit: 10, 
        offset: 0, 
        sortBy: 'date_desc' 
      });
      
      const dates = result.transactions.map(t => new Date(t.date).getTime());
      expect(dates).toEqual([...dates].sort((a, b) => b - a));
    });

    it('should sort by amount ascending', async () => {
      const result = await apiClient.getTransactions({ 
        limit: 10, 
        offset: 0, 
        sortBy: 'amount_asc' 
      });
      
      const amounts = result.transactions.map(t => t.amount);
      expect(amounts).toEqual([...amounts].sort((a, b) => a - b));
    });
  });

  describe('getSpendingGoals', () => {
    it('should fetch spending goals', async () => {
      const mockGoals = {
        goals: [
          { id: 'goal_001', category: 'Groceries', status: 'warning' }
        ]
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGoals)
      });

      const result = await apiClient.getSpendingGoals();
      
      expect(result.goals).toHaveLength(1);
      expect(result.goals[0].status).toBe('warning');
    });
  });
});

import { renderHook, waitFor } from '@testing-library/react';
import { CustomerService } from '../../api/customerService';
import {
    useCustomerProfile,
    useDashboardData,
    useFilterOptions,
    useRefreshMultiple,
    useSpendingCategories,
    useSpendingGoals,
    useSpendingSummary,
    useSpendingTrends,
    useTransactions
} from '../useApi';

// Mock the CustomerService
jest.mock('../../api/customerService', () => ({
  CustomerService: {
    getProfile: jest.fn(),
    getSpendingSummary: jest.fn(),
    getSpendingCategories: jest.fn(),
    getSpendingTrends: jest.fn(),
    getTransactions: jest.fn(),
    getSpendingGoals: jest.fn(),
    getFilterOptions: jest.fn(),
    getDashboardData: jest.fn()
  }
}));

// Mock console.error to keep test output clean
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('useApi Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCustomerProfile', () => {
    it('should fetch customer profile on mount', async () => {
      const mockProfile = { id: 'cust_12345', name: 'Test User', email: 'test@email.com' };
      CustomerService.getProfile.mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useCustomerProfile());

      // Initial state should be loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getProfile).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual(mockProfile);
      expect(result.current.error).toBeNull();
    });

    it('should handle customer profile fetch error', async () => {
      const errorMessage = 'Failed to fetch profile';
      CustomerService.getProfile.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCustomerProfile());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching customer profile:',
        expect.any(Error)
      );
    });

    it('should refetch customer profile', async () => {
      const mockProfile = { id: 'cust_12345', name: 'Test User' };
      CustomerService.getProfile.mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useCustomerProfile());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Trigger refetch
      result.current.refetch();

      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getProfile).toHaveBeenCalledTimes(2);
    });
  });

  describe('useSpendingSummary', () => {
    it('should fetch spending summary with default period', async () => {
      const mockSummary = { totalSpent: 1000, transactionCount: 25 };
      CustomerService.getSpendingSummary.mockResolvedValue(mockSummary);

      const { result } = renderHook(() => useSpendingSummary());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getSpendingSummary).toHaveBeenCalledWith('30d');
      expect(result.current.data).toEqual(mockSummary);
    });

    it('should fetch spending summary with custom period', async () => {
      const mockSummary = { totalSpent: 500, transactionCount: 10 };
      CustomerService.getSpendingSummary.mockResolvedValue(mockSummary);

      const { result } = renderHook(() => useSpendingSummary('7d'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getSpendingSummary).toHaveBeenCalledWith('7d');
      expect(result.current.data).toEqual(mockSummary);
    });

    it('should refetch when period changes', async () => {
      const mockSummary = { totalSpent: 1000 };
      CustomerService.getSpendingSummary.mockResolvedValue(mockSummary);

      const { result, rerender } = renderHook(
        ({ period }) => useSpendingSummary(period),
        { initialProps: { period: '30d' } }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getSpendingSummary).toHaveBeenCalledWith('30d');

      // Change period
      rerender({ period: '90d' });

      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getSpendingSummary).toHaveBeenCalledWith('90d');
    });
  });

  describe('useSpendingCategories', () => {
    it('should fetch spending categories with default period', async () => {
      const mockCategories = { categories: [{ name: 'Groceries', amount: 500 }] };
      CustomerService.getSpendingCategories.mockResolvedValue(mockCategories);

      const { result } = renderHook(() => useSpendingCategories());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getSpendingCategories).toHaveBeenCalledWith({ period: '30d' });
      expect(result.current.data).toEqual(mockCategories);
    });

    it('should fetch spending categories with custom period', async () => {
      const mockCategories = { categories: [{ name: 'Entertainment', amount: 200 }] };
      CustomerService.getSpendingCategories.mockResolvedValue(mockCategories);

      const { result } = renderHook(() => useSpendingCategories('7d'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getSpendingCategories).toHaveBeenCalledWith({ period: '7d' });
      expect(result.current.data).toEqual(mockCategories);
    });
  });

  describe('useSpendingTrends', () => {
    it('should fetch spending trends with default months', async () => {
      const mockTrends = { trends: [{ month: '2024-01', total: 1000 }] };
      CustomerService.getSpendingTrends.mockResolvedValue(mockTrends);

      const { result } = renderHook(() => useSpendingTrends());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getSpendingTrends).toHaveBeenCalledWith(12);
      expect(result.current.data).toEqual(mockTrends);
    });

    it('should fetch spending trends with custom months', async () => {
      const mockTrends = { trends: [{ month: '2024-01', total: 1000 }] };
      CustomerService.getSpendingTrends.mockResolvedValue(mockTrends);

      const { result } = renderHook(() => useSpendingTrends(6));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getSpendingTrends).toHaveBeenCalledWith(6);
      expect(result.current.data).toEqual(mockTrends);
    });
  });

  describe('useTransactions', () => {
    it('should fetch transactions with default params', async () => {
      const mockTransactions = {
        transactions: [{ id: 'txn_1', amount: 100 }],
        pagination: { total: 1 }
      };
      CustomerService.getTransactions.mockResolvedValue(mockTransactions);

      const { result } = renderHook(() => useTransactions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getTransactions).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        category: undefined,
        startDate: undefined,
        endDate: undefined,
        sortBy: 'date_desc'
      });
      expect(result.current.data).toEqual(mockTransactions);
    });

    it('should fetch transactions with custom params', async () => {
      const mockTransactions = {
        transactions: [{ id: 'txn_1', amount: 100 }],
        pagination: { total: 1 }
      };
      CustomerService.getTransactions.mockResolvedValue(mockTransactions);

      const filters = {
        limit: 10,
        offset: 5,
        category: 'Groceries',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        sortBy: 'amount_asc'
      };

      const { result } = renderHook(() => useTransactions(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getTransactions).toHaveBeenCalledWith(filters);
      expect(result.current.data).toEqual(mockTransactions);
    });

    it('should refetch when filters change', async () => {
      const mockTransactions = {
        transactions: [{ id: 'txn_1', amount: 100 }],
        pagination: { total: 1 }
      };
      CustomerService.getTransactions.mockResolvedValue(mockTransactions);

      const { result, rerender } = renderHook(
        ({ filters }) => useTransactions(filters),
        { initialProps: { filters: { limit: 10 } } }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getTransactions).toHaveBeenCalledWith({ limit: 10 });

      // Change filters
      rerender({ filters: { limit: 20, category: 'Groceries' } });

      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getTransactions).toHaveBeenCalledWith({
        limit: 20,
        category: 'Groceries'
      });
    });
  });

  describe('useSpendingGoals', () => {
    it('should fetch spending goals', async () => {
      const mockGoals = { goals: [{ id: 'goal_1', category: 'Groceries' }] };
      CustomerService.getSpendingGoals.mockResolvedValue(mockGoals);

      const { result } = renderHook(() => useSpendingGoals());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getSpendingGoals).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual(mockGoals);
    });
  });

  describe('useFilterOptions', () => {
    it('should fetch filter options', async () => {
      const mockFilters = { categories: ['Groceries', 'Entertainment'] };
      CustomerService.getFilterOptions.mockResolvedValue(mockFilters);

      const { result } = renderHook(() => useFilterOptions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getFilterOptions).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual(mockFilters);
    });
  });

  describe('useDashboardData', () => {
    it('should fetch dashboard data with default options', async () => {
      const mockDashboardData = {
        profile: { name: 'Test User' },
        summary: { totalSpent: 1000 }
      };
      CustomerService.getDashboardData.mockResolvedValue(mockDashboardData);

      const { result } = renderHook(() => useDashboardData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getDashboardData).toHaveBeenCalledWith({});
      expect(result.current.data).toEqual(mockDashboardData);
    });

    it('should fetch dashboard data with custom options', async () => {
      const mockDashboardData = {
        profile: { name: 'Test User' },
        summary: { totalSpent: 500 }
      };
      CustomerService.getDashboardData.mockResolvedValue(mockDashboardData);

      const options = {
        period: '7d',
        months: 6,
        transactionLimit: 5
      };

      const { result } = renderHook(() => useDashboardData(options));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getDashboardData).toHaveBeenCalledWith(options);
      expect(result.current.data).toEqual(mockDashboardData);
    });

    it('should refetch when options change', async () => {
      const mockDashboardData = { profile: { name: 'Test User' } };
      CustomerService.getDashboardData.mockResolvedValue(mockDashboardData);

      const { result, rerender } = renderHook(
        ({ options }) => useDashboardData(options),
        { initialProps: { options: { period: '30d' } } }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getDashboardData).toHaveBeenCalledWith({ period: '30d' });

      // Change options
      rerender({ options: { period: '90d', months: 3 } });

      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(CustomerService.getDashboardData).toHaveBeenCalledWith({
        period: '90d',
        months: 3
      });
    });
  });

  describe('useRefreshMultiple', () => {
    it('should refresh multiple data sources', async () => {
      const mockRefetch1 = jest.fn().mockResolvedValue(undefined);
      const mockRefetch2 = jest.fn().mockResolvedValue(undefined);

      const { result } = renderHook(() => useRefreshMultiple([mockRefetch1, mockRefetch2]));

      expect(result.current.isRefreshing).toBe(false);
      expect(result.current.error).toBeNull();

      // Trigger refresh
      const refreshPromise = result.current.refreshAll();

      expect(result.current.isRefreshing).toBe(true);

      await refreshPromise;

      expect(result.current.isRefreshing).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockRefetch1).toHaveBeenCalledTimes(1);
      expect(mockRefetch2).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when refreshing multiple data sources', async () => {
      const errorMessage = 'Failed to refresh';
      const mockRefetch1 = jest.fn().mockRejectedValue(new Error(errorMessage));
      const mockRefetch2 = jest.fn().mockResolvedValue(undefined);

      const { result } = renderHook(() => useRefreshMultiple([mockRefetch1, mockRefetch2]));

      await result.current.refreshAll();

      expect(result.current.isRefreshing).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith(
        'Error refreshing data:',
        expect.any(Error)
      );
    });

    it('should update when refetchFunctions array changes', async () => {
      const mockRefetch1 = jest.fn().mockResolvedValue(undefined);
      const mockRefetch2 = jest.fn().mockResolvedValue(undefined);

      const { result, rerender } = renderHook(
        ({ refetchFunctions }) => useRefreshMultiple(refetchFunctions),
        { initialProps: { refetchFunctions: [mockRefetch1] } }
      );

      // Refresh with first set of functions
      await result.current.refreshAll();
      expect(mockRefetch1).toHaveBeenCalledTimes(1);
      expect(mockRefetch2).not.toHaveBeenCalled();

      // Update refetch functions
      rerender({ refetchFunctions: [mockRefetch1, mockRefetch2] });

      // Refresh with updated functions
      await result.current.refreshAll();
      
      expect(mockRefetch1).toHaveBeenCalledTimes(2);
      expect(mockRefetch2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const errorMessage = 'Network error';
      CustomerService.getProfile.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCustomerProfile());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.data).toBeNull();
    });

    it('should reset error on successful refetch', async () => {
      // First call fails
      CustomerService.getProfile
        .mockRejectedValueOnce(new Error('Initial error'))
        .mockResolvedValueOnce({ name: 'Recovered User' });

      const { result } = renderHook(() => useCustomerProfile());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Initial error');

      // Refetch succeeds
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual({ name: 'Recovered User' });
    });
  });
});
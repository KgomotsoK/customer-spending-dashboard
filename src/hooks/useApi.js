// Custom hooks for API data fetching WITHOUT TanStack Query
import { useCallback, useEffect, useState } from 'react';
import { CustomerService } from '../api/customerService';

export const useCustomerProfile = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CustomerService.getProfile();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch customer profile');
      console.error('Error fetching customer profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

export const useSpendingSummary = (period = '30d') => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CustomerService.getSpendingSummary(period);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch spending summary');
      console.error('Error fetching spending summary:', err);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

export const useSpendingCategories = (period = '30d') => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CustomerService.getSpendingCategories({ period });
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch spending categories');
      console.error('Error fetching spending categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

export const useSpendingTrends = (months = 12) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CustomerService.getSpendingTrends(months);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch spending trends');
      console.error('Error fetching spending trends:', err);
    } finally {
      setIsLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

export const useTransactions = ({
  limit = 20,
  offset = 0,
  category,
  startDate,
  endDate,
  sortBy = 'date_desc'
} = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CustomerService.getTransactions({
        limit,
        offset,
        category,
        startDate,
        endDate,
        sortBy
      });
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [limit, offset, category, startDate, endDate, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

export const useSpendingGoals = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CustomerService.getSpendingGoals();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch spending goals');
      console.error('Error fetching spending goals:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

export const useFilterOptions = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CustomerService.getFilterOptions();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch filter options');
      console.error('Error fetching filter options:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

// Combined hook for dashboard data
export const useDashboardData = (options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CustomerService.getDashboardData(options);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

// Hook for refreshing multiple data sources
export const useRefreshMultiple = (refetchFunctions = []) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await Promise.all(refetchFunctions.map(refetch => refetch()));
    } catch (err) {
      setError(err.message || 'Failed to refresh data');
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchFunctions]);

  return { refreshAll, isRefreshing, error };
};
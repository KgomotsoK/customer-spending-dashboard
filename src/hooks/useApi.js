// Custom hooks for API data fetching using TanStack Query
import { useQuery } from '@tanstack/react-query';
import { CustomerService } from '../api/customerService';

export const useCustomerProfile = () => {
  return useQuery({
    queryKey: ['customerProfile'],
    queryFn: CustomerService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSpendingSummary = (period = '30d') => {
  return useQuery({
    queryKey: ['spendingSummary', period],
    queryFn: () => CustomerService.getSpendingSummary(period),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSpendingCategories = (period = '30d') => {
  return useQuery({
    queryKey: ['spendingCategories', period],
    queryFn: () => CustomerService.getSpendingCategories(period),
    staleTime: 2 * 60 * 1000,
  });
};

export const useSpendingTrends = (months = 12) => {
  return useQuery({
    queryKey: ['spendingTrends', months],
    queryFn: () => CustomerService.getSpendingTrends(months),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTransactions = ({ limit = 20, offset = 0, category, startDate, endDate, sortBy = 'date_desc' }) => {
  return useQuery({
    queryKey: ['transactions', { limit, offset, category, startDate, endDate, sortBy }],
    queryFn: () => CustomerService.getTransactions({ limit, offset, category, startDate, endDate, sortBy }),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useSpendingGoals = () => {
  return useQuery({
    queryKey: ['spendingGoals'],
    queryFn: CustomerService.getSpendingGoals(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: CustomerService.getFilterOptions(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

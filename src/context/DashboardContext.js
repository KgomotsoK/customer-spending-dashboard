import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CustomerService } from '../api/customerService';

const DashboardContext = createContext(undefined);

export const DashboardProvider = ({ children }) => {
  // State for dashboard filters
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [sortBy, setSortBy] = useState('date_desc');
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    summary: null,
    categories: null,
    trends: null,
    recentTransactions: null,
    goals: null,
    filters: null,
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  /**
   * Reset all filters to defaults
   */
  const resetFilters = useCallback(() => {
    setSelectedPeriod('30d');
    setCategoryFilter(null);
    setDateRange({ startDate: null, endDate: null });
    setSortBy('date_desc');
  }, []);

  /**
   * Load dashboard data with current filters
   */
  const loadDashboardData = useCallback(async (options = {}) => {
    setDashboardData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await CustomerService.getDashboardData({
        period: selectedPeriod,
        months: 12,
        transactionLimit: 10,
        ...options
      });
      
      setDashboardData(prev => ({
        ...prev,
        ...data,
        isLoading: false,
        lastUpdated: new Date().toISOString()
      }));
      
      return data;
    } catch (error) {
      setDashboardData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
      throw error;
    }
  }, [selectedPeriod]);

  /**
   * Refresh specific dashboard section
   */
  const refreshSection = useCallback(async (section) => {
    const refreshFunctions = {
      profile: () => CustomerService.getProfile(),
      summary: () => CustomerService.getSpendingSummary(selectedPeriod),
      categories: () => CustomerService.getSpendingCategories({ period: selectedPeriod }),
      trends: () => CustomerService.getSpendingTrends(12),
      goals: () => CustomerService.getSpendingGoals(),
      transactions: (filters) => CustomerService.getTransactions({
        limit: 10,
        sortBy,
        category: categoryFilter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        ...filters
      })
    };
    
    if (refreshFunctions[section]) {
      try {
        const data = await refreshFunctions[section]();
        setDashboardData(prev => ({
          ...prev,
          [section]: data,
          lastUpdated: new Date().toISOString()
        }));
        return data;
      } catch (error) {
        console.error(`Failed to refresh ${section}:`, error);
        throw error;
      }
    }
  }, [selectedPeriod, sortBy, categoryFilter, dateRange]);

  // Memoized context value
  const value = useMemo(() => ({
    // Filters
    selectedPeriod,
    setSelectedPeriod,
    categoryFilter,
    setCategoryFilter,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    resetFilters,
    
    // Dashboard data
    dashboardData,
    setDashboardData,
    loadDashboardData,
    refreshSection,
    
    // Convenience computed values
    hasActiveFilters: categoryFilter || dateRange.startDate || dateRange.endDate || selectedPeriod !== '30d'
  }), [
    selectedPeriod,
    categoryFilter,
    dateRange,
    sortBy,
    dashboardData,
    resetFilters,
    loadDashboardData,
    refreshSection
  ]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Hook for specific dashboard sections
export const useDashboardSection = (section) => {
  const { dashboardData, refreshSection } = useDashboard();
  
  return {
    data: dashboardData[section],
    isLoading: dashboardData.isLoading,
    error: dashboardData.error,
    refresh: () => refreshSection(section),
    lastUpdated: dashboardData.lastUpdated
  };
};
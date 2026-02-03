import { apiClient } from './apiClient';
import { getCurrentUser } from './authService';

/**
 * Get the current customer ID from authenticated user
 */
export const getCurrentCustomerId = () => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No authenticated user found');
  }
  return user.customerId || user.id;
};

/**
 * Customer Profile Service
 */
export const CustomerService = {
  /**
   * Get customer profile
   */
  async getProfile(customerId = null) {
    const id = customerId || getCurrentCustomerId();

    return apiClient.get(`/customers/${id}/profile.json`);
  },

  /**
   * Get spending summary for a period
   */
  async getSpendingSummary(period = '30d', customerId = null) {
    const id = customerId || getCurrentCustomerId();
    return apiClient.get(`/customers/${id}/spending/summary.json`, {
      params: { period }
    }).then(data => data[period] || data['30d']);
  },

  /**
   * Get spending by categories with optional date range
   */
  async getSpendingCategories(options = {}) {
    const {
      period = '30d',
      startDate,
      endDate,
      customerId = null
    } = options;
    
    const id = customerId || getCurrentCustomerId();
    return apiClient.get(`/customers/${id}/spending/categories.json`, {
      params: { period, startDate, endDate }
    }).then(data => data[period] || data['30d']);
  },

  /**
   * Get spending trends over months
   */
  async getSpendingTrends(months = 12, customerId = null) {
    const id = customerId || getCurrentCustomerId();
    return apiClient.get(`/customers/${id}/spending/trends.json`)
      .then(data => ({
        trends: data.trends.slice(-months),
        metadata: {
          monthsRequested: months,
          totalMonths: data.trends.length
        }
      }));
  },

  /**
   * Get transactions with filtering and pagination
   */
  async getTransactions(filters = {}, customerId = null) {
    const {
      limit = 20,
      offset = 0,
      category,
      startDate,
      endDate,
      sortBy = 'date_desc'
    } = filters;
    
    const id = customerId || getCurrentCustomerId();
    
    // Fetch all transactions and process client-side for demo
    const data = await apiClient.get(`/customers/${id}/transactions.json`);
    
    return processTransactions(data.transactions, {
      limit,
      offset,
      category,
      startDate,
      endDate,
      sortBy
    });
  },

  /**
   * Get spending goals
   */
  async getSpendingGoals(customerId = null) {
    const id = customerId || getCurrentCustomerId();
    return apiClient.get(`/customers/${id}/goals.json`);
  },

  /**
   * Get available filters and categories
   */
  async getFilterOptions(customerId = null) {
    const id = customerId || getCurrentCustomerId();
    return apiClient.get(`/customers/${id}/filters.json`);
  },

  /**
   * Get all customer data in a single call (for dashboard initialization)
   */
  async getDashboardData(options = {}) {
    const {
      period = '30d',
      months = 12,
      transactionLimit = 10,
      customerId = null
    } = options;
    
    const id = customerId || getCurrentCustomerId();
    
    try {
      const [
        profile,
        summary,
        categories,
        trends,
        recentTransactions,
        goals,
        filters
      ] = await Promise.all([
        this.getProfile(id),
        this.getSpendingSummary(period, id),
        this.getSpendingCategories({ period }, id),
        this.getSpendingTrends(months, id),
        this.getTransactions({ limit: transactionLimit }, id),
        this.getSpendingGoals(id),
        this.getFilterOptions(id)
      ]);
      
      return {
        profile,
        summary,
        categories,
        trends,
        recentTransactions,
        goals,
        filters,
        metadata: {
          period,
          months,
          customerId: id,
          fetchedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }
};

/**
 * Process transactions with filtering and sorting
 */
function processTransactions(transactions, filters) {
  let filtered = [...transactions];
  const { category, startDate, endDate, sortBy } = filters;
  
  // Apply category filter
  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }
  
  // Apply date filters
  if (startDate) {
    filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
  }
  
  if (endDate) {
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    filtered = filtered.filter(t => new Date(t.date) <= endDateTime);
  }
  
  // Apply sorting
  const sortFunctions = {
    date_asc: (a, b) => new Date(a.date) - new Date(b.date),
    date_desc: (a, b) => new Date(b.date) - new Date(a.date),
    amount_asc: (a, b) => a.amount - b.amount,
    amount_desc: (a, b) => b.amount - a.amount,
  };
  
  if (sortFunctions[sortBy]) {
    filtered.sort(sortFunctions[sortBy]);
  }
  
  // Apply pagination
  const total = filtered.length;
  const { limit = 20, offset = 0 } = filters;
  const paginated = filtered.slice(offset, offset + limit);
  
  return {
    transactions: paginated,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
      totalPages: Math.ceil(total / limit),
      currentPage: Math.floor(offset / limit) + 1
    }
  };
}

export default CustomerService;
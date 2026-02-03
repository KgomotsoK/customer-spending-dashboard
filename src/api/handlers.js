// MSW handlers for mocking API endpoints
import { http, HttpResponse, delay } from 'msw';
import {
  customerProfile,
  getSpendingSummary,
  getSpendingCategories,
  monthlyTrends,
  getTransactions,
  spendingGoals,
  filterOptions,
  mockCustomerId
} from './mockData';

const API_DELAY = 300; // Simulate network latency

export const handlers = [
  // Customer Profile
  http.get('/api/customers/:customerId/profile', async ({ params }) => {
    await delay(API_DELAY);
    
    if (params.customerId !== mockCustomerId) {
      return HttpResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(customerProfile);
  }),

  // Spending Summary
  http.get('/api/customers/:customerId/spending/summary', async ({ params, request }) => {
    await delay(API_DELAY);
    
    if (params.customerId !== mockCustomerId) {
      return HttpResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30d';
    
    return HttpResponse.json(getSpendingSummary(period));
  }),

  // Spending by Category
  http.get('/api/customers/:customerId/spending/categories', async ({ params, request }) => {
    await delay(API_DELAY);
    
    if (params.customerId !== mockCustomerId) {
      return HttpResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30d';
    
    return HttpResponse.json(getSpendingCategories(period));
  }),

  // Monthly Spending Trends
  http.get('/api/customers/:customerId/spending/trends', async ({ params, request }) => {
    await delay(API_DELAY);
    
    if (params.customerId !== mockCustomerId) {
      return HttpResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    const url = new URL(request.url);
    const months = parseInt(url.searchParams.get('months') || '12', 10);
    
    return HttpResponse.json({
      trends: monthlyTrends.trends.slice(-months)
    });
  }),

  // Transactions
  http.get('/api/customers/:customerId/transactions', async ({ params, request }) => {
    await delay(API_DELAY);
    
    if (params.customerId !== mockCustomerId) {
      return HttpResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const category = url.searchParams.get('category');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const sortBy = url.searchParams.get('sortBy') || 'date_desc';
    
    return HttpResponse.json(getTransactions({
      limit,
      offset,
      category,
      startDate,
      endDate,
      sortBy
    }));
  }),

  // Spending Goals
  http.get('/api/customers/:customerId/goals', async ({ params }) => {
    await delay(API_DELAY);
    
    if (params.customerId !== mockCustomerId) {
      return HttpResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(spendingGoals);
  }),

  // Filter Options
  http.get('/api/customers/:customerId/filters', async ({ params }) => {
    await delay(API_DELAY);
    
    if (params.customerId !== mockCustomerId) {
      return HttpResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(filterOptions);
  })
];

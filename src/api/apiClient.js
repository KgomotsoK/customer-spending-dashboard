// src/api/apiClient.js
import axios from 'axios';

// Create base client
const createApiClient = (baseURL = '/api') => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('spending_insights_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const customError = new Error(
        error.response?.data?.message || error.message || 'An error occurred'
      );
      customError.status = error.response?.status;
      customError.code = error.response?.data?.code;
      return Promise.reject(customError);
    }
  );

  return instance;
};

// Export singleton instance
export const apiClient = createApiClient();

// Export factory for testing or multiple instances
export const createClient = createApiClient;
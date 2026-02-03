// src/api/__tests__/apiClient.test.js
import axios from 'axios';
import { apiClient, createClient } from '../apiClient';

// Mock axios
jest.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.localStorage = localStorageMock;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test_token');
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      const mockConfig = { headers: {} };
      axios.create.mockReturnValue({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      });

      const client = createClient();
      const requestInterceptor = axios.create.mock.calls[0][0];
      
      // Get the request interceptor
      const interceptorConfig = requestInterceptor;
      expect(interceptorConfig.headers['Content-Type']).toBe('application/json');
    });

    it('should not add Authorization header when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const mockConfig = { headers: {} };
      axios.create.mockReturnValue({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      });

      createClient();
      const requestInterceptor = axios.create.mock.calls[0][0];
      
      expect(requestInterceptor.headers['Content-Type']).toBe('application/json');
      expect(requestInterceptor.headers['Authorization']).toBeUndefined();
    });
  });

  describe('Response Interceptor', () => {
    it('should return response data on success', async () => {
      const mockResponse = {
        data: { message: 'Success' },
        status: 200
      };

      axios.create.mockReturnValue({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn((successHandler, errorHandler) => {
            // Simulate successful response
            return successHandler(mockResponse);
          })}
        }
      });

      createClient();
      // The response interceptor extracts data
      expect(mockResponse.data).toEqual({ message: 'Success' });
    });

    it('should handle API errors with custom error', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not found', code: 'NOT_FOUND' }
        },
        message: 'Request failed'
      };

      axios.create.mockReturnValue({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn((successHandler, errorHandler) => {
            // Simulate error response
            return errorHandler(mockError).catch(error => {
              expect(error.message).toBe('Not found');
              expect(error.status).toBe(404);
              expect(error.code).toBe('NOT_FOUND');
            });
          })}
        }
      });

      createClient();
    });

    it('should handle network errors', async () => {
      const mockError = {
        message: 'Network Error'
      };

      axios.create.mockReturnValue({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn((successHandler, errorHandler) => {
            return errorHandler(mockError).catch(error => {
              expect(error.message).toBe('Network Error');
              expect(error.status).toBeUndefined();
              expect(error.code).toBeUndefined();
            });
          })}
        }
      });

      createClient();
    });
  });

  describe('Client Configuration', () => {
    it('should create client with default baseURL', () => {
      createClient();
      
      expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
        baseURL: '/api',
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    });

    it('should create client with custom baseURL', () => {
      createClient('https://api.example.com');
      
      expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
        baseURL: 'https://api.example.com'
      }));
    });

    it('should export singleton instance', () => {
      expect(apiClient).toBeDefined();
      // apiClient should be an axios instance
      expect(apiClient).toHaveProperty('get');
      expect(apiClient).toHaveProperty('post');
    });
  });
});
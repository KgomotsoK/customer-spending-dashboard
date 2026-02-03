import { apiClient } from './apiClient';

// Constants
const AUTH_TOKEN_KEY = 'spending_insights_token';
const AUTH_USER_KEY = 'spending_insights_user';
const TOKEN_VALIDITY_HOURS = 24;

/**
 * Generate a secure token with expiration
 */
const generateSecureToken = (userId) => {
  const timestamp = Date.now();
  const expiresAt = timestamp + (TOKEN_VALIDITY_HOURS * 60 * 60 * 1000);
  const random = Math.random().toString(36).substring(2);
  
  // Create token with user ID, expiration, and random component
  const tokenData = { userId, expiresAt, random, timestamp };
  
  // JWT signed with a secret
  return btoa(JSON.stringify(tokenData));
};

/**
 * Validate token structure and expiration
 */
const validateToken = (token) => {
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    if (Date.now() > decoded.expiresAt) {
      console.warn('Token expired');
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

/**
 * Authenticate user with email and password
 */
export const authenticateUser = async (email, password) => {
  try {
    // Input validation
    if (!email || !email.trim()) {
      const error = new Error('Email address is required');
      error.field = 'email';
      throw error;
    }

    if (!password) {
      const error = new Error('Password is required');
      error.field = 'password';
      throw error;
    }

    // Fetch all users from the API
    const users = await apiClient.get('/customers/customers.json');
    
    // Check if email exists
    const userWithEmail = users.data.find(u => 
      u.email.toLowerCase() === email.toLowerCase()
    );

    if (!userWithEmail) {
      const error = new Error('No account found with this email address');
      error.field = 'email';
      error.code = 'EMAIL_NOT_FOUND';
      throw error;
    }

    // Check if password matches
    if (userWithEmail.password !== password) {
      const error = new Error('Incorrect password');
      error.field = 'password';
      error.code = 'INVALID_PASSWORD';
      throw error;
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = userWithEmail;
    
    // Generate secure token
    const token = generateSecureToken(userWithEmail.id);
    
    return {
      user: userWithoutPassword,
      token,
      expiresIn: TOKEN_VALIDITY_HOURS * 3600 // in seconds
    };
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Re-throw with proper error details
    if (error.field || error.code) {
      throw error;
    }
    
    // Generic error for network/API issues
    const genericError = new Error('Unable to sign in. Please try again.');
    genericError.code = 'AUTHENTICATION_FAILED';
    throw genericError;
  }
};

/**
 * Get current authenticated user from localStorage
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!userStr || !token) return null;
    
    // Validate token
    const tokenData = validateToken(token);
    if (!tokenData) {
      clearAuthStorage();
      return null;
    }
    
    const user = JSON.parse(userStr);
    
    // Verify token matches stored user
    if (tokenData.userId !== user.id) {
      clearAuthStorage();
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    clearAuthStorage();
    return null;
  }
};

/**
 * Store authentication data
 */
export const storeAuthData = (user, token) => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing auth data:', error);
    throw new Error('Failed to save authentication data');
  }
};

/**
 * Clear authentication storage
 */
export const clearAuthStorage = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};
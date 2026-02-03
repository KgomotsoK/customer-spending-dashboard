import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  authenticateUser,
  clearAuthStorage,
  getCurrentUser,
  storeAuthData
} from '../api/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        // Clear invalid auth data
        clearAuthStorage();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authenticateUser(email, password);
      
      // Store authentication data
      storeAuthData(result.user, result.token);
      
      // Update state
      setUser(result.user);
      
      return result.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh user data (useful when user profile updates)
   */
  const refreshUser = useCallback(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Memoized context value
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    clearError,
    refreshUser
  }), [user, isLoading, error, login, logout, clearError, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
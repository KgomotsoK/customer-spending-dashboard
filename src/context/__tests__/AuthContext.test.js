import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as authService from '../../api/authService';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock the auth service
jest.mock('../../api/authService', () => ({
  authenticateUser: jest.fn(),
  getCurrentUser: jest.fn(),
  storeAuthData: jest.fn(),
  clearAuthStorage: jest.fn()
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, clearError, refreshUser } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{user ? user.name : 'no-user'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <button onClick={() => login('john.doe@email.co.za', 'John@26')}>Login</button>
      <button onClick={() => login('wrong@email.com', 'wrong')}>Bad Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={clearError}>Clear Error</button>
      <button onClick={refreshUser}>Refresh User</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage mocks
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  it('should render without crashing and initialize auth', async () => {
    // Mock no user initially
    authService.getCurrentUser.mockReturnValue(null);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Should show loading initially
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    // Wait for initialization to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('should initialize with existing user', async () => {
    const mockUser = { id: 'cust_12345', name: 'Existing User', email: 'existing@email.com' };
    authService.getCurrentUser.mockReturnValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('Existing User');
    expect(authService.getCurrentUser).toHaveBeenCalled();
  });

  it('should handle auth initialization error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    authService.getCurrentUser.mockImplementation(() => {
      throw new Error('Token validation failed');
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    expect(authService.clearAuthStorage).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should login successfully', async () => {
    authService.getCurrentUser.mockReturnValue(null);
    const mockUser = { id: 'cust_12345', name: 'John Doe', email: 'john.doe@email.com' };
    const mockResult = { user: mockUser, token: 'test-token', expiresIn: 86400 };
    
    authService.authenticateUser.mockResolvedValue(mockResult);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initialization
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    const loginButton = screen.getByText('Login');
    await userEvent.click(loginButton);
    
    // Should show loading during login
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    expect(authService.authenticateUser).toHaveBeenCalledWith('john.doe@email.com', 'John@26');
    expect(authService.storeAuthData).toHaveBeenCalledWith(mockUser, 'test-token');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should handle login error', async () => {
    authService.getCurrentUser.mockReturnValue(null);
    authService.authenticateUser.mockRejectedValue(new Error('Invalid email or password'));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    const badLoginButton = screen.getByText('Bad Login');
    await userEvent.click(badLoginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid email or password');
    });
    
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('should logout successfully', async () => {
    const mockUser = { id: 'cust_12345', name: 'Logged In User' };
    authService.getCurrentUser.mockReturnValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
    
    const logoutButton = screen.getByText('Logout');
    await userEvent.click(logoutButton);
    
    expect(authService.clearAuthStorage).toHaveBeenCalled();
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should clear error', async () => {
    authService.getCurrentUser.mockReturnValue(null);
    authService.authenticateUser.mockRejectedValue(new Error('Login failed'));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    // Trigger error
    const badLoginButton = screen.getByText('Bad Login');
    await userEvent.click(badLoginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Login failed');
    });
    
    // Clear error
    const clearErrorButton = screen.getByText('Clear Error');
    await userEvent.click(clearErrorButton);
    
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should refresh user', async () => {
    const mockUser = { id: 'cust_12345', name: 'Original User' };
    const updatedUser = { id: 'cust_12345', name: 'Updated User' };
    
    authService.getCurrentUser
      .mockReturnValueOnce(mockUser) // Initial call
      .mockReturnValue(updatedUser); // Subsequent calls
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Original User');
    });
    
    const refreshButton = screen.getByText('Refresh User');
    await userEvent.click(refreshButton);
    
    expect(authService.getCurrentUser).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('user')).toHaveTextContent('Updated User');
  });

  it('should throw error when used outside provider', () => {
    // Suppress the expected error in console
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleErrorSpy.mockRestore();
  });
});
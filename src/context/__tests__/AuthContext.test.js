import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user">{user ? user.name : 'no-user'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <button onClick={() => login('john.doe@email.co.za', 'John@26')}>Login</button>
      <button onClick={() => login('wrong@email.com', 'wrong')}>Bad Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
  });

  it('should login successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByText('Login');
    await userEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
    }, { timeout: 3000 });
    
    expect(screen.getByTestId('user')).toHaveTextContent('Thabo Mokoena');
  });

  it('should handle login error', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const badLoginButton = screen.getByText('Bad Login');
    await userEvent.click(badLoginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid email or password');
    }, { timeout: 3000 });
    
    expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
  });

  it('should logout successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // First login
    await userEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
    }, { timeout: 3000 });
    
    // Then logout
    await userEvent.click(screen.getByText('Logout'));
    
    expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleError.mockRestore();
  });
});

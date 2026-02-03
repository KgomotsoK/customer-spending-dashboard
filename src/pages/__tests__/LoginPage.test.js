import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import LoginPage from '../LoginPage';

// Mock CSS
jest.mock('../../styles/main.css', () => ({}));

// Mock useToast hook
jest.mock('../../hooks/use-toast', () => ({
  useToast: jest.fn()
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn()
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <svg data-testid="alert-circle">AlertCircle</svg>,
  Eye: () => <svg data-testid="eye">Eye</svg>,
  EyeOff: () => <svg data-testid="eye-off">EyeOff</svg>,
  Lock: () => <svg data-testid="lock">Lock</svg>,
  LogIn: () => <svg data-testid="log-in">LogIn</svg>,
  Mail: () => <svg data-testid="mail">Mail</svg>,
  Shield: () => <svg data-testid="shield">Shield</svg>
}));

describe('LoginPage Component', () => {
  const mockNavigate = jest.fn();
  const mockLocation = { state: null };
  const mockToast = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock react-router-dom hooks
    const { useNavigate, useLocation } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue(mockLocation);
    
    // Mock useToast hook
    useToast.mockReturnValue({ toast: mockToast });
  });

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should render login form with branding', () => {
    renderLoginPage();
    
    expect(screen.getByText('Spending Insights')).toBeInTheDocument();
    expect(screen.getByText('Secure Customer Portal')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText('Your security is our priority')).toBeInTheDocument();
  });

  it('should show error for empty email', async () => {
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText('Email address is required')).toBeInTheDocument();
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('should show error for invalid email format', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(submitButton);
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('should show error for empty password', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(submitButton);
    
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('should update email input', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should update password input and toggle visibility', async () => {
    renderLoginPage();
    
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, 'testpassword');
    
    expect(passwordInput).toHaveValue('testpassword');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Toggle password visibility
    const toggleButton = document.querySelector('.password-toggle');
    await userEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should disable form elements during loading', async () => {
    // Mock auth context to return loading state
    const mockLogin = jest.fn().mockResolvedValue({});
    const { useAuth } = require('../../context/AuthContext');
    
    // Temporarily mock the auth context
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      login: mockLogin,
      isLoading: true,
      error: null,
      clearError: jest.fn(),
      isAuthenticated: false
    }));
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /signing in/i });
    
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Signing in...');
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should show login error from auth context', async () => {
    // Mock auth context with error
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    const { useAuth } = require('../../context/AuthContext');
    
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      login: mockLogin,
      isLoading: false,
      error: 'Invalid email or password',
      clearError: jest.fn(),
      isAuthenticated: false
    }));
    
    renderLoginPage();
    
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should clear error when user starts typing', async () => {
    // Mock auth context with error
    const mockClearError = jest.fn();
    const { useAuth } = require('../../context/AuthContext');
    
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      login: jest.fn(),
      isLoading: false,
      error: 'Invalid email or password',
      clearError: mockClearError,
      isAuthenticated: false
    }));
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 't');
    
    expect(mockClearError).toHaveBeenCalled();
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should redirect if already authenticated', async () => {
    // Mock auth context with authenticated user
    const { useAuth } = require('../../context/AuthContext');
    
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      login: jest.fn(),
      isLoading: false,
      error: null,
      clearError: jest.fn(),
      isAuthenticated: true
    }));
    
    renderLoginPage();
    
    // Should navigate to dashboard
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should call login with trimmed email', async () => {
    // Mock auth context
    const mockLogin = jest.fn().mockResolvedValue({});
    const { useAuth } = require('../../context/AuthContext');
    
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: jest.fn(),
      isAuthenticated: false
    }));
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, '  test@example.com  ');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);
    
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Welcome back!',
      description: 'Successfully signed in to your account.',
      duration: 3000,
    });
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should show toast on login error', async () => {
    // Mock auth context
    const error = new Error('Invalid credentials');
    const mockLogin = jest.fn().mockRejectedValue(error);
    const { useAuth } = require('../../context/AuthContext');
    
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: jest.fn(),
      isAuthenticated: false
    }));
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Sign in failed',
        description: 'Invalid credentials',
        variant: 'destructive',
        duration: 5000,
      });
    });
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should have footer links', () => {
    renderLoginPage();
    
    expect(screen.getByText('Contact support')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('should have security notice', () => {
    renderLoginPage();
    
    expect(screen.getByText(/Your security is our priority/i)).toBeInTheDocument();
    expect(screen.getByTestId('shield')).toBeInTheDocument();
  });
});
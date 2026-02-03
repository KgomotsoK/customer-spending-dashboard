import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../LoginPage';
import { AuthProvider } from '../../context/AuthContext';

// Mock CSS
jest.mock('../../styles/main.css', () => ({}));

describe('LoginPage Component', () => {
  const renderLoginPage = () => {
    return render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
  };

  it('should render login form', () => {
    renderLoginPage();
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show demo credentials hint', () => {
    renderLoginPage();
    
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
  });

  it('should show error for empty form submission', async () => {
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
  });

  it('should update email input', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should update password input', async () => {
    renderLoginPage();
    
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, 'testpassword');
    
    expect(passwordInput).toHaveValue('testpassword');
  });

  it('should show error for invalid credentials', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'wrong@email.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});

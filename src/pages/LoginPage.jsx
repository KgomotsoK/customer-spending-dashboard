// src/pages/LoginPage.jsx
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  Shield
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import '../styles/main.css';

const LOGO_URL = 'https://rmkcdn.successfactors.com/05298491/24cdd26a-2959-4419-8350-6.png';

const LoginPage = () => {
  const { 
    login, 
    isLoading, 
    error, 
    clearError, 
    isAuthenticated 
  } = useAuth();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors when inputs change
  useEffect(() => {
    if (localError) setLocalError('');
    if (error) clearError();
  }, [email, password, clearError, error]);

  const validateForm = () => {
    if (!email.trim()) {
      setLocalError('Email address is required');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      setLocalError('Password is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(email.trim(), password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
        duration: 3000,
      });
    } catch (err) {
      // Error is already handled by AuthContext
      toast({
        title: "Sign in failed",
        description: err.message || "Please check your credentials and try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDemoLogin = async () => {
    setEmail('thabo.mokoena@email.co.za');
    setPassword('demo123');
    
    // Small delay for better UX
    setTimeout(async () => {
      try {
        await login('thabo.mokoena@email.co.za', 'demo123');
        toast({
          title: "Demo session started",
          description: "You're now viewing sample data for demonstration purposes.",
          duration: 4000,
        });
      } catch (err) {
        toast({
          title: "Demo login failed",
          description: err.message || "Unable to start demo session.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }, 300);
  };

  const displayError = localError || error;

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo & Brand */}
        <header className="login-card__header">
          <div className="login-card__logo-container">
            <img 
              src={LOGO_URL} 
              alt="Capitec Logo" 
              className="login-card__logo"
            />
            <div className="login-card__brand">
              <h1 className="login-card__title">Spending Insights</h1>
              <p className="login-card__subtitle">Secure Customer Portal</p>
            </div>
          </div>
        </header>

        {/* Login Form */}
        <div className="login-card__content">
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {displayError && (
              <div className="login-form__error" role="alert">
                <AlertCircle size={18} />
                <span>{displayError}</span>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email" className="form-field__label">
                <Mail size={18} className="form-field__icon" />
                <span>Email Address</span>
              </label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password" className="form-field__label">
                <Lock size={18} className="form-field__icon" />
                <span>Password</span>
              </label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="button button--primary button--lg login-form__submit"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

      

          {/* Security Notice */}
          <div className="security-notice">
            <Shield size={16} />
            <span>Your security is our priority. All data is encrypted and protected.</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="login-card__footer">
          <p className="login-card__footer-text">
            Need help? <a href="#" className="link">Contact support</a>
          </p>
          <div className="login-card__footer-links">
            <a href="#" className="link link--muted">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#" className="link link--muted">Terms of Service</a>
          </div>
        </footer>
      </div>

      {/* Background Decor */}
      <div className="login-page__background">
        <div className="login-page__pattern"></div>
      </div>
    </div>
  );
};

export default LoginPage;
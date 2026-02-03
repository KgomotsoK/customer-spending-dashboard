import { AlertCircle, Eye, EyeOff, Lock, LogIn, Mail, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import '../styles/main.css';

const LOGO_URL = 'https://rmkcdn.successfactors.com/05298491/24cdd26a-2959-4419-8350-6.png';

const LoginPage = () => {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

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
    if (fieldErrors.email || fieldErrors.password) {
      setFieldErrors({ email: '', password: '' });
    }
  }, [email, password]); // Removed clearError and error from dependencies to avoid infinite loop

  const validateForm = () => {
    const errors = { email: '', password: '' };
    let isValid = true;

    // Validate email
    if (!email.trim()) {
      errors.email = 'Email address is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address (e.g., user@example.com)';
      isValid = false;
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 3) {
      errors.password = 'Password is too short';
      isValid = false;
    }

    if (!isValid) {
      setFieldErrors(errors);
      // Set a general error message
      if (errors.email && errors.password) {
        setLocalError('Please fill in all required fields');
      } else if (errors.email) {
        setLocalError(errors.email);
      } else if (errors.password) {
        setLocalError(errors.password);
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // CRITICAL: Prevent form submission and page refresh
    e.stopPropagation(); // Stop event propagation
    
    console.log('Form submitted'); // Debug log
    
    // Clear previous errors
    setLocalError('');
    setFieldErrors({ email: '', password: '' });

    // Validate form
    if (!validateForm()) {
      console.log('Validation failed'); // Debug log
      return; // Stop here if validation fails
    }

    console.log('Attempting login...'); // Debug log

    try {
      await login(email.trim(), password);
      
      // Success - show toast
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
        duration: 3000,
      });
      
      console.log('Login successful'); // Debug log
    } catch (err) {
      console.log('Login error caught:', err); // Debug log
      
      // Provide specific error messages based on the error
      const errorMessage = err.message || 'An error occurred';
      const errorField = err.field;
      const errorCode = err.code;

      console.log('Error details:', { errorMessage, errorField, errorCode }); // Debug log
      
      // Handle specific error types
      if (errorCode === 'EMAIL_NOT_FOUND' || errorField === 'email') {
        setFieldErrors({ 
          email: 'No account found with this email address', 
          password: '' 
        });
        setLocalError('The email address you entered is not registered');
      } else if (errorCode === 'INVALID_PASSWORD' || errorField === 'password') {
        setFieldErrors({ 
          email: '', 
          password: 'Incorrect password' 
        });
        setLocalError('The password you entered is incorrect');
      } else if (errorMessage.toLowerCase().includes('email')) {
        setFieldErrors({ 
          email: 'No account found with this email address', 
          password: '' 
        });
        setLocalError('The email address you entered is not registered');
      } else if (errorMessage.toLowerCase().includes('password')) {
        setFieldErrors({ 
          email: '', 
          password: 'Incorrect password' 
        });
        setLocalError('The password you entered is incorrect');
      } else {
        // Generic error
        setFieldErrors({ 
          email: '', 
          password: '' 
        });
        setLocalError(errorMessage);
      }

      // Show error toast
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const displayError = localError || error;

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo & Brand */}
        <div className="login-card__header">
          <img 
            src={LOGO_URL} 
            alt="Company Logo" 
            className="login-card__logo"
          />
          <h1 className="login-card__title">Spending Insights</h1>
          <p className="login-card__subtitle">Secure Customer Portal</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {displayError && (
            <div className="login-form__error" role="alert">
              <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
              {displayError}
            </div>
          )}

          <div className="login-form__field">
            <label className="form-field__label" htmlFor="email">
              <Mail className="form-field__icon" size={16} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`input ${fieldErrors.email ? 'input--error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              autoFocus
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email && (
              <span id="email-error" className="field-error" role="alert">
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className="login-form__field">
            <label className="form-field__label" htmlFor="password">
              <Lock className="form-field__icon" size={16} />
              Password
            </label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`input ${fieldErrors.password ? 'input--error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <span id="password-error" className="field-error" role="alert">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="button button--primary button--lg login-form__submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="button-spinner"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="security-notice">
          <Shield size={14} style={{ marginRight: '6px', flexShrink: 0 }} />
          Your security is our priority. All data is encrypted and protected.
        </div>

        {/* Footer */}
        <div className="login-card__footer">
          <p>
            Need help? <a href="#support">Contact support</a>
          </p>
          <p>
            <a href="#privacy">Privacy Policy</a> • <a href="#terms">Terms of Service</a>
          </p>
        </div>
      </div>

      {/* Background Decor */}
      <div className="login-page__background"></div>
    </div>
  );
};

export default LoginPage;
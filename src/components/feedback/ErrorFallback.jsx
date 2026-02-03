// src/components/feedback/ErrorFallback.jsx
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/main.css';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate('/dashboard');
    resetErrorBoundary();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="error-fallback">
      <div className="error-fallback__content">
        <div className="error-fallback__icon">
          <AlertTriangle size={64} />
        </div>
        
        <h1 className="error-fallback__title">Something went wrong</h1>
        
        <div className="error-fallback__details">
          <p className="error-fallback__message">
            {error?.message || 'An unexpected error occurred'}
          </p>
          
          {process.env.NODE_ENV === 'development' && error?.stack && (
            <details className="error-fallback__stack">
              <summary>Error details</summary>
              <pre>{error.stack}</pre>
            </details>
          )}
        </div>
        
        <div className="error-fallback__actions">
          <button
            onClick={resetErrorBoundary}
            className="button button--primary"
          >
            <RefreshCw size={18} />
            <span>Try again</span>
          </button>
          
          <button
            onClick={handleGoHome}
            className="button button--secondary"
          >
            <Home size={18} />
            <span>Go to dashboard</span>
          </button>
          
          <button
            onClick={handleRefresh}
            className="button button--outline"
          >
            <RefreshCw size={18} />
            <span>Reload page</span>
          </button>
        </div>
        
        <div className="error-fallback__help">
          <p>
            If the problem persists, please{' '}
            <a href="mailto:support@capitec.com" className="link">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
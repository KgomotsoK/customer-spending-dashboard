import { AlertCircle, LogOut, RefreshCw } from 'lucide-react';

const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred',
  onRetry,
  onLogout,
  showRetry = true
}) => {
  return (
    <div className="error-state">
      <div className="error-state__content">
        <AlertCircle className="error-state__icon" size={48} />
        <h3 className="error-state__title">{title}</h3>
        <p className="error-state__message">{message}</p>
        
        <div className="error-state__actions">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="button button--primary"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          )}
          
          {onLogout && (
            <button
              onClick={onLogout}
              className="button button--secondary"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          )}
        </div>
        
        <div className="error-state__help">
          <p>
            If the problem persists, please{' '}
            <a href="#" className="link">contact support</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
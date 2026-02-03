import { ArrowLeft, Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="not-found-page">
      <div className="not-found-page__content">
        <div className="not-found-page__icon">
          <Search size={96} />
          <div className="not-found-page__code">404</div>
        </div>
        
        <h1 className="not-found-page__title">Page Not Found</h1>
        
        <p className="not-found-page__message">
          The page you're looking for doesn't exist or has been moved.
          Please check the URL or navigate back to the dashboard.
        </p>
        
        <div className="not-found-page__actions">
          <button
            onClick={() => navigate(-1)}
            className="button button--secondary"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="button button--primary"
          >
            <Home size={18} />
            <span>Go to Dashboard</span>
          </button>
        </div>
        
        <div className="not-found-page__help">
          <p>
            Need help?{' '}
            <a href="/help" className="link">
              Visit our help center
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
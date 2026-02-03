import { Clock, Mail, Wrench } from 'lucide-react';
import '../styles/main.css';

const MaintenancePage = () => {
  const estimatedTime = '2:00 PM - 4:00 PM (GMT+2)';
  
  return (
    <div className="maintenance-page">
      <div className="maintenance-page__content">
        <div className="maintenance-page__icon">
          <Wrench size={80} />
        </div>
        
        <h1 className="maintenance-page__title">Temporarily Unavailable</h1>
        
        <p className="maintenance-page__message">
          We're currently performing scheduled maintenance to improve your experience.
          The dashboard will be back online shortly.
        </p>
        
        <div className="maintenance-page__info">
          <div className="maintenance-page__info-item">
            <Clock size={20} />
            <span>Estimated completion: <strong>{estimatedTime}</strong></span>
          </div>
        </div>
        
        <div className="maintenance-page__actions">
          <button
            onClick={() => window.location.reload()}
            className="button button--primary"
          >
            Check Status
          </button>
          
          <a
            href="mailto:support@example.com"
            className="button button--outline"
          >
            <Mail size={18} />
            <span>Contact Support</span>
          </a>
        </div>
        
        <div className="maintenance-page__updates">
          <h3>Latest Updates</h3>
          <ul>
            <li>✅ Enhanced security features</li>
            <li>🚀 Performance improvements</li>
            <li>📊 New analytics capabilities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
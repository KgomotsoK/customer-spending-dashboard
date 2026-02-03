// src/components/feedback/LoadingState.jsx
import { Loader } from 'lucide-react';

const LoadingState = ({ 
  message = 'Loading...', 
  fullScreen = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'loading-state--sm',
    md: 'loading-state--md',
    lg: 'loading-state--lg'
  };

  return (
    <div className={`loading-state ${sizeClasses[size]} ${fullScreen ? 'loading-state--fullscreen' : ''}`}>
      <div className="loading-state__content">
        <Loader className="loading-state__spinner" size={size === 'lg' ? 48 : 32} />
        <p className="loading-state__message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
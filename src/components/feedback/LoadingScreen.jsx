import { Loader } from 'lucide-react';
import '../../styles/main.css';

const LoadingScreen = ({ message = 'Loading...', fullScreen = true }) => {
  const content = (
    <div className="loading-screen">
      <div className="loading-screen__content">
        <div className="loading-screen__spinner-container">
          <Loader className="loading-screen__spinner" size={48} />
          <div className="loading-screen__dots">
            <div className="loading-screen__dot" />
            <div className="loading-screen__dot" />
            <div className="loading-screen__dot" />
          </div>
        </div>
        <p className="loading-screen__message">{message}</p>
        <p className="loading-screen__hint">
          Please wait while we prepare your dashboard...
        </p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-screen--fullscreen">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingScreen;
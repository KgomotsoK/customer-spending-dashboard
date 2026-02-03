import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './styles/main.css';

// Service Worker Registration
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload to update?')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

// Performance monitoring
const reportWebVitals = (metric) => {
  if (process.env.NODE_ENV === 'production') {
    // Send metrics to analytics service
    const body = JSON.stringify(metric);
    navigator.sendBeacon('/api/analytics/performance', body);
  }
  
  console.log(metric);
};

// Initialize Sentry (if configured)
const initializeErrorTracking = () => {
  if (process.env.REACT_APP_SENTRY_DSN) {
    import('@sentry/react').then((Sentry) => {
      Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [
          new Sentry.BrowserTracing({
            tracePropagationTargets: ["localhost", /^https:\/\/yourdomain\.com/],
          }),
          new Sentry.Replay(),
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
    });
  }
};

// Create root with error handling
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app with error boundary
const renderApp = () => {
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    
    // Show error screen
    root.render(
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <h1 style={{ color: '#dc3545', marginBottom: '16px' }}>Application Error</h1>
        <p style={{ marginBottom: '24px', color: '#6c757d' }}>
          We're sorry, but something went wrong. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }
};

// Initialize error tracking
initializeErrorTracking();

// Start the application
if (process.env.NODE_ENV === 'production') {
  // Production startup with performance monitoring
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(reportWebVitals);
    onFID(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
    
    renderApp();
  }).catch(() => {
    // Fallback if web-vitals fails to load
    renderApp();
  });
} else {
  // Development startup
  renderApp();
}

// Handle uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  
  // Send to error tracking service
  if (window.analytics) {
    window.analytics.track('uncaught_error', {
      message: event.error.message,
      stack: event.error.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Send to error tracking service
  if (window.analytics) {
    window.analytics.track('unhandled_rejection', {
      reason: event.reason?.toString(),
      stack: event.reason?.stack
    });
  }
});
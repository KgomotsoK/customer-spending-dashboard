import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ErrorFallback from './components/feedback/ErrorFallback';
import LoadingScreen from './components/feedback/LoadingScreen';
import Header from './components/layout/Header';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import MaintenancePage from './pages/MaintanancePage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/main.css';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Create query client with production configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors, only on 5xx or network errors
        if (error?.status && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      }
    }
  }
});

// Error Boundary wrapper for the entire app
const AppErrorBoundary = ({ children }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      // Log to error monitoring service in production
      console.error('Application error:', error, errorInfo);
      
      // Send to analytics service
      if (window.analytics) {
        window.analytics.track('app_error', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack
        });
      }
    }}
    onReset={() => {
      // Reload the app on error recovery
      window.location.reload();
    }}
  >
    {children}
  </ErrorBoundary>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Verifying your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public route component (redirects if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main layout for authenticated users
const MainLayout = () => {
  return (
    <DashboardProvider>
      <div className="app">
        <Header />
        <main className="app__main">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </DashboardProvider>
  );
};

// Check for maintenance mode
const isMaintenanceMode = import.meta.env.REACT_APP_MAINTENANCE_MODE === 'true';

// Main App component
function App() {
  // Add performance monitoring
  React.useEffect(() => {
    if (import.meta.env.NODE_ENV === 'production') {
      // Initialize performance monitoring
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`[Performance] ${entry.name}: ${entry.duration}ms`);
        });
      });
      observer.observe({ entryTypes: ['measure', 'resource'] });
      
      // Cleanup
      return () => observer.disconnect();
    }
  }, []);

  // Handle offline/online status
  React.useEffect(() => {
    const handleOnline = () => {
      queryClient.invalidateQueries();
    };

    const handleOffline = () => {
      console.warn('Application is offline. Data may be stale.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppErrorBoundary>
          <Router>
            <AuthProvider>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  } />
                  
                  {/* Protected routes */}
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </Router>
        </AppErrorBoundary>
      </ToastProvider>
      
      {/* React Query DevTools (development only) */}
      {import.meta.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

export default App;
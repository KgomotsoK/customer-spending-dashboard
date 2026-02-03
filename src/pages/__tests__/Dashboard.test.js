import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { DashboardProvider } from '../../context/DashboardContext';
import Dashboard from '../Dashboard';

// Mock CSS
jest.mock('../../styles/main.css', () => ({}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

// Mock hooks
jest.mock('../../hooks/useApi', () => ({
  useCustomerProfile: jest.fn(),
  useSpendingSummary: jest.fn(),
  useSpendingCategories: jest.fn(),
  useSpendingTrends: jest.fn(),
  useSpendingGoals: jest.fn(),
  useFilterOptions: jest.fn()
}));

// Mock components
jest.mock('../../components/cards/CustomerHeader', () => () => (
  <div data-testid="customer-header">CustomerHeader</div>
));

jest.mock('../../components/cards/GoalCard', () => ({ loading }) => (
  <div data-testid="goal-card">
    {loading ? 'Loading Goal' : 'GoalCard'}
  </div>
));

jest.mock('../../components/cards/KpiCard', () => ({ loading }) => (
  <div data-testid="kpi-card">
    {loading ? 'Loading KPI' : 'KpiCard'}
  </div>
));

jest.mock('../../components/charts/CategoryPieChart', () => ({ loading }) => (
  <div data-testid="category-pie-chart">
    {loading ? 'Loading Pie Chart' : 'CategoryPieChart'}
  </div>
));

jest.mock('../../components/charts/TrendChart', () => ({ loading }) => (
  <div data-testid="trend-chart">
    {loading ? 'Loading Trend Chart' : 'TrendChart'}
  </div>
));

jest.mock('../../components/layout/PeriodSelector', () => ({ selectedPeriod, onPeriodChange }) => (
  <div data-testid="period-selector">
    <button onClick={() => onPeriodChange('7d')}>7D</button>
    <button onClick={() => onPeriodChange('30d')}>30D</button>
    <button onClick={() => onPeriodChange('90d')}>90D</button>
    <span>Selected: {selectedPeriod}</span>
  </div>
));

jest.mock('../../components/tables/TransactionsTable', () => () => (
  <div data-testid="transactions-table">TransactionsTable</div>
));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CreditCard: () => <svg data-testid="credit-card">CreditCard</svg>,
  Tag: () => <svg data-testid="tag">Tag</svg>,
  TrendingUp: () => <svg data-testid="trending-up">TrendingUp</svg>,
  Wallet: () => <svg data-testid="wallet">Wallet</svg>
}));

// Mock formatters
jest.mock('../../utils/formatters', () => ({
  formatCurrency: (amount) => `R ${amount.toFixed(2)}`,
  getPeriodLabel: (period) => `Last ${period}`,
  parseMonth: () => new Date()
}));

describe('Dashboard Component', () => {
  const mockUseCustomerProfile = require('../../hooks/useApi').useCustomerProfile;
  const mockUseSpendingSummary = require('../../hooks/useApi').useSpendingSummary;
  const mockUseSpendingCategories = require('../../hooks/useApi').useSpendingCategories;
  const mockUseSpendingTrends = require('../../hooks/useApi').useSpendingTrends;
  const mockUseSpendingGoals = require('../../hooks/useApi').useSpendingGoals;
  const mockUseFilterOptions = require('../../hooks/useApi').useFilterOptions;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock default hook implementations
    mockUseCustomerProfile.mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn(),
      error: null
    });
    
    mockUseSpendingSummary.mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn()
    });
    
    mockUseSpendingCategories.mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn()
    });
    
    mockUseSpendingTrends.mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn()
    });
    
    mockUseSpendingGoals.mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn()
    });
    
    mockUseFilterOptions.mockReturnValue({
      data: null,
      isLoading: false
    });
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardProvider>
            <Dashboard />
          </DashboardProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should render all dashboard sections when authenticated', () => {
    // Mock authenticated user
    const { useAuth } = require('../../context/AuthContext');
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      isAuthenticated: true
    }));

    renderDashboard();
    
    expect(screen.getByTestId('customer-header')).toBeInTheDocument();
    expect(screen.getByText('Spending Overview')).toBeInTheDocument();
    expect(screen.getByTestId('period-selector')).toBeInTheDocument();
    
    // Should render KPI cards (loading state)
    const kpiCards = screen.getAllByTestId('kpi-card');
    expect(kpiCards.length).toBe(4);
    
    expect(screen.getByTestId('category-pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
    expect(screen.getByText('Spending Goals')).toBeInTheDocument();
    expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
    expect(screen.getByText(/Customer Spending Insights/i)).toBeInTheDocument();
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should return null when not authenticated', () => {
    // Mock unauthenticated user
    const { useAuth } = require('../../context/AuthContext');
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      isAuthenticated: false
    }));

    const { container } = renderDashboard();
    
    // Should return null (ProtectedRoute handles redirect)
    expect(container.firstChild).toBeNull();
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should show loading states initially', () => {
    // Mock authenticated user
    const { useAuth } = require('../../context/AuthContext');
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      isAuthenticated: true
    }));

    renderDashboard();
    
    // All KPI cards should show loading
    const kpiCards = screen.getAllByTestId('kpi-card');
    kpiCards.forEach(card => {
      expect(card).toHaveTextContent('Loading KPI');
    });
    
    // Charts should show loading
    expect(screen.getByTestId('category-pie-chart')).toHaveTextContent('Loading Pie Chart');
    expect(screen.getByTestId('trend-chart')).toHaveTextContent('Loading Trend Chart');
    
    // Goals should show loading
    const goalCards = screen.getAllByTestId('goal-card');
    goalCards.forEach(card => {
      expect(card).toHaveTextContent('Loading Goal');
    });
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should display data when loaded', () => {
    // Mock authenticated user
    const { useAuth } = require('../../context/AuthContext');
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      isAuthenticated: true
    }));

    // Mock loaded data
    mockUseCustomerProfile.mockReturnValue({
      data: { name: 'Test Customer', email: 'test@email.com' },
      isLoading: false,
      refetch: jest.fn(),
      error: null
    });
    
    mockUseSpendingSummary.mockReturnValue({
      data: {
        totalSpent: 1000,
        transactionCount: 25,
        averageTransaction: 40,
        topCategory: 'Groceries',
        comparedToPrevious: {
          spentChange: 12.5,
          transactionChange: -5.2
        }
      },
      isLoading: false,
      refetch: jest.fn()
    });
    
    mockUseSpendingCategories.mockReturnValue({
      data: { categories: [] },
      isLoading: false,
      refetch: jest.fn()
    });
    
    mockUseSpendingTrends.mockReturnValue({
      data: { trends: [] },
      isLoading: false,
      refetch: jest.fn()
    });
    
    mockUseSpendingGoals.mockReturnValue({
      data: {
        goals: [
          { id: 'goal1', category: 'Entertainment', status: 'on_track' },
          { id: 'goal2', category: 'Groceries', status: 'warning' }
        ]
      },
      isLoading: false,
      refetch: jest.fn()
    });
    
    mockUseFilterOptions.mockReturnValue({
      data: { dateRangePresets: ['7d', '30d', '90d'] },
      isLoading: false
    });
    
    renderDashboard();
    
    // KPI cards should show data (not loading)
    const kpiCards = screen.getAllByTestId('kpi-card');
    kpiCards.forEach(card => {
      expect(card).toHaveTextContent('KpiCard');
    });
    
    // Charts should show data
    expect(screen.getByTestId('category-pie-chart')).toHaveTextContent('CategoryPieChart');
    expect(screen.getByTestId('trend-chart')).toHaveTextContent('TrendChart');
    
    // Goals should show data
    const goalCards = screen.getAllByTestId('goal-card');
    expect(goalCards.length).toBe(2);
    goalCards.forEach(card => {
      expect(card).toHaveTextContent('GoalCard');
    });
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should show empty state for goals when no data', () => {
    // Mock authenticated user
    const { useAuth } = require('../../context/AuthContext');
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      isAuthenticated: true
    }));

    mockUseCustomerProfile.mockReturnValue({
      data: { name: 'Test Customer' },
      isLoading: false,
      refetch: jest.fn(),
      error: null
    });
    
    mockUseSpendingGoals.mockReturnValue({
      data: { goals: [] },
      isLoading: false,
      refetch: jest.fn()
    });
    
    renderDashboard();
    
    expect(screen.getByText('No spending goals')).toBeInTheDocument();
    expect(screen.getByText('Set up spending goals to track your budget effectively')).toBeInTheDocument();
    expect(screen.getByText('Create Goal')).toBeInTheDocument();
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should handle period change', async () => {
    // Mock authenticated user
    const { useAuth } = require('../../context/AuthContext');
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      isAuthenticated: true
    }));

    renderDashboard();
    
    const periodButtons = screen.getAllByRole('button');
    const sevenDayButton = periodButtons.find(btn => btn.textContent === '7D');
    
    await userEvent.click(sevenDayButton);
    
    // The period selector should update
    expect(screen.getByText('Selected: 7d')).toBeInTheDocument();
    
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });

  it('should show custom date range when set', () => {
    // Mock authenticated user
    const { useAuth } = require('../../context/AuthContext');
    const { useDashboard } = require('../../context/DashboardContext');
    
    const originalUseAuth = useAuth;
    const originalUseDashboard = useDashboard;
    
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      isAuthenticated: true
    }));
    
    require('../../context/DashboardContext').useDashboard = jest.fn(() => ({
      selectedPeriod: '30d',
      setSelectedPeriod: jest.fn(),
      dateRange: {
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      }
    }));
    
    renderDashboard();
    
    // Should show custom date range text
    expect(screen.getByText('From Jan 1')).toBeInTheDocument();
    expect(screen.getByText('to Jan 31')).toBeInTheDocument();
    
    // Restore original hooks
    require('../../context/AuthContext').useAuth = originalUseAuth;
    require('../../context/DashboardContext').useDashboard = originalUseDashboard;
  });

  it('should show footer with version info', () => {
    // Mock authenticated user
    const { useAuth } = require('../../context/AuthContext');
    const originalUseAuth = useAuth;
    require('../../context/AuthContext').useAuth = jest.fn(() => ({
      isAuthenticated: true
    }));

    // Mock env variable
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      REACT_APP_VERSION: '1.2.3'
    };
    
    renderDashboard();
    
    expect(screen.getByText('Customer Spending Insights')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
    expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    
    // Restore original env
    process.env = originalEnv;
    // Restore original useAuth
    require('../../context/AuthContext').useAuth = originalUseAuth;
  });
});
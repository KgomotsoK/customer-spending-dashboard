// src/pages/Dashboard.jsx
import {
  AlertCircle,
  CreditCard,
  Filter,
  RefreshCw,
  Tag,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { useCallback } from 'react';
import CustomerHeader from '../components/cards/CustomerHeader';
import GoalCard from '../components/cards/GoalCard';
import KpiCard from '../components/cards/KpiCard';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import TrendChart from '../components/charts/TrendChart';
import PeriodSelector from '../components/layout/PeriodSelector';
import TransactionsTable from '../components/tables/TransactionsTable';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import {
  useCustomerProfile,
  useFilterOptions,
  useSpendingCategories,
  useSpendingGoals,
  useSpendingSummary,
  useSpendingTrends
} from '../hooks/useApi';
import '../styles/main.css';
import { formatCurrency, getPeriodLabel } from '../utils/formatters';

const Dashboard = () => {
  const { 
    selectedPeriod,
    categoryFilter,
    dateRange,
    sortBy,
    resetFilters,
    hasActiveFilters
  } = useDashboard();
  
  const { 
    user, 
    isAuthenticated, 
    logout 
  } = useAuth();

  // Fetch all data using your existing hooks
  const { 
    data: customer, 
    isLoading: customerLoading,
    refetch: refetchCustomer,
    error: customerError 
  } = useCustomerProfile();
  
  const { 
    data: summary, 
    isLoading: summaryLoading,
    refetch: refetchSummary 
  } = useSpendingSummary(selectedPeriod);
  
  const { 
    data: categories, 
    isLoading: categoriesLoading,
    refetch: refetchCategories 
  } = useSpendingCategories(selectedPeriod);
  
  const { 
    data: trends, 
    isLoading: trendsLoading,
    refetch: refetchTrends 
  } = useSpendingTrends(12);
  
  const { 
    data: goals, 
    isLoading: goalsLoading,
    refetch: refetchGoals 
  } = useSpendingGoals();
  
  const {
    data: filterOptions,
    isLoading: filtersLoading
  } = useFilterOptions();

  // Handle data refresh
  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([
        refetchCustomer(),
        refetchSummary(),
        refetchCategories(),
        refetchTrends(),
        refetchGoals()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, [refetchCustomer, refetchSummary, refetchCategories, refetchTrends, refetchGoals]);

  // Handle period change
  const handlePeriodChange = useCallback((newPeriod) => {
    // The period is managed by DashboardContext
    console.log('Period changed to:', newPeriod);
  }, []);

  // Show loading state on initial load
  if (!isAuthenticated) {
    return null; // Will redirect via ProtectedRoute
  }

  const isInitialLoading = customerLoading && !customer;

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="dashboard-header__info">
          <h1 className="dashboard-header__title">Spending Insights</h1>
          <p className="dashboard-header__subtitle">
            Welcome back, {user?.name || customer?.name || 'Customer'}
          </p>
        </div>
        <div className="dashboard-header__actions">
          <button
            onClick={handleRefresh}
            className="button button--secondary button--sm"
            disabled={summaryLoading}
            title="Refresh data"
          >
            <RefreshCw size={16} className={summaryLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="button button--outline button--sm"
            >
              <Filter size={16} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </header>

      <main className="dashboard__main">
        {/* Customer Profile Header */}
        <section className="dashboard__section">
          <CustomerHeader 
            customer={customer} 
            loading={customerLoading}
            error={customerError}
          />
        </section>

        {/* Period Selector & Title */}
        <section className="dashboard__section">
          <div className="dashboard__section-header">
            <div>
              <h2 className="dashboard__section-title">Spending Overview</h2>
              <p className="dashboard__section-subtitle">
                {getPeriodLabel(selectedPeriod)}
                {(dateRange.startDate || dateRange.endDate) && (
                  <span className="dashboard__custom-range">
                    {dateRange.startDate && ` • From ${new Date(dateRange.startDate).toLocaleDateString('en-ZA', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}`}
                    {dateRange.endDate && ` to ${new Date(dateRange.endDate).toLocaleDateString('en-ZA', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}`}
                  </span>
                )}
              </p>
            </div>
            <PeriodSelector 
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
              availablePresets={filterOptions?.dateRangePresets}
              loading={filtersLoading}
            />
          </div>

          {/* KPI Cards Grid */}
          <div className="kpi-grid">
            <KpiCard
              title="Total Spent"
              value={formatCurrency(summary?.totalSpent || 0)}
              change={summary?.comparedToPrevious?.spentChange}
              changeLabel="vs previous period"
              icon={Wallet}
              variant="primary"
              loading={summaryLoading || isInitialLoading}
              tooltip="Total amount spent in the selected period"
            />
            <KpiCard
              title="Transactions"
              value={summary?.transactionCount || 0}
              change={summary?.comparedToPrevious?.transactionChange}
              changeLabel="vs previous period"
              icon={CreditCard}
              loading={summaryLoading || isInitialLoading}
              tooltip="Number of transactions in the selected period"
            />
            <KpiCard
              title="Avg. Transaction"
              value={formatCurrency(summary?.averageTransaction || 0)}
              icon={TrendingUp}
              loading={summaryLoading || isInitialLoading}
              tooltip="Average transaction amount"
            />
            <KpiCard
              title="Top Category"
              value={summary?.topCategory || 'No data'}
              icon={Tag}
              loading={summaryLoading || isInitialLoading}
              subtitle={summary?.topCategory && categories?.categories?.find(c => c.name === summary.topCategory) && 
                formatCurrency(categories.categories.find(c => c.name === summary.topCategory)?.amount || 0)
              }
            />
          </div>
        </section>

        {/* Charts Row */}
        <section className="dashboard__section">
          <div className="charts-grid">
            <CategoryPieChart 
              data={categories} 
              loading={categoriesLoading || isInitialLoading}
              currency="ZAR"
            />
            <TrendChart 
              data={trends} 
              loading={trendsLoading || isInitialLoading}
              currency="ZAR"
            />
          </div>
        </section>

        {/* Spending Goals */}
        <section className="dashboard__section">
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Spending Goals</h3>
              {goals?.goals?.length > 0 && (
                <span className="card__badge">
                  {goals.goals.filter(g => g.status === 'on_track').length} of {goals.goals.length} on track
                </span>
              )}
            </div>
            <div className="card__content">
              {goalsLoading || isInitialLoading ? (
                <div className="goals-loading">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <GoalCard key={i} loading />
                  ))}
                </div>
              ) : goals?.goals?.length > 0 ? (
                <div className="goals-grid">
                  {goals.goals.map((goal) => (
                    <GoalCard 
                      key={goal.id} 
                      goal={goal}
                      currency="ZAR"
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state__icon">
                    <Tag size={24} />
                  </div>
                  <div className="empty-state__content">
                    <h4 className="empty-state__title">No spending goals</h4>
                    <p className="empty-state__description">
                      Set up spending goals to track your budget effectively
                    </p>
                    <button className="button button--outline button--sm">
                      Create Goal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="dashboard__section">
          <TransactionsTable />
        </section>

        {/* Demo Notice */}
        {process.env.NODE_ENV === 'development' && (
          <section className="dashboard__section">
            <div className="alert alert--info">
              <AlertCircle size={20} />
              <div className="alert__content">
                <strong>Demo Mode:</strong> This dashboard displays mock data for demonstration purposes. 
                All financial amounts are simulated.
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__container">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Customer Spending Insights. All rights reserved.
          </p>
          <div className="footer__links">
            <a href="#" className="footer__link">Privacy Policy</a>
            <a href="#" className="footer__link">Terms of Service</a>
            <a href="#" className="footer__link">Contact Support</a>
            <span className="footer__version">
              v{process.env.REACT_APP_VERSION || '1.0.0'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
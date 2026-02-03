import {
  ArrowUpDown,
  Car,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Film,
  Filter,
  Heart,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  X,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useFilterOptions, useTransactions } from '../../hooks/useApi';
import '../../styles/main.css';
import { formatCurrency, formatDate } from '../../utils/formatters';

const iconMap = {
  'shopping-cart': ShoppingCart,
  'zap': Zap,
  'car': Car,
  'film': Film,
  'utensils': Utensils,
  'shopping-bag': ShoppingBag,
  'heart': Heart
};

const TransactionsTable = () => {
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    categoryFilter,
    dateRange,
    sortBy,
    setCategoryFilter,
    setDateRange,
    setSortBy
  } = useDashboard();

  const ITEMS_PER_PAGE = 10;
  
  const { data: filterData } = useFilterOptions();
  const { 
    data, 
    isLoading, 
    isError,
    refetch 
  } = useTransactions({
    limit: ITEMS_PER_PAGE,
    offset: page * ITEMS_PER_PAGE,
    category: categoryFilter || undefined,
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
    sortBy
  });

  const toggleSort = (field) => {
    const newSortBy = sortBy === `${field}_desc` ? `${field}_asc` : `${field}_desc`;
    setSortBy(newSortBy);
    setPage(0);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value === 'all' ? null : e.target.value);
    setPage(0);
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const clearDateRange = () => {
    setDateRange({ startDate: null, endDate: null });
    setPage(0);
  };

  const clearAllFilters = () => {
    setCategoryFilter(null);
    setDateRange({ startDate: null, endDate: null });
    setPage(0);
  };

  const hasActiveFilters = categoryFilter || dateRange.startDate || dateRange.endDate;
  const activeFilterCount = (categoryFilter ? 1 : 0) + (dateRange.startDate ? 1 : 0);

  const transactions = data?.transactions || [];
  const pagination = data?.pagination || { total: 0, hasMore: false };
  const totalPages = Math.max(1, Math.ceil(pagination.total / ITEMS_PER_PAGE));

  if (isError) {
    return (
      <div className="card">
        <div className="card__content error-state">
          <div className="error-state__icon">⚠️</div>
          <h4 className="error-state__title">Failed to load transactions</h4>
          <p className="error-state__message">Please check your connection and try again.</p>
          <button 
            className="button button--primary button--sm"
            onClick={() => refetch()}
          >
            <RefreshCw size={16} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__header-content">
          <div className="card__header-top">
            <h3 className="card__title">Recent Transactions</h3>
            <div className="card__header-actions">
              <button
                className={`button button--outline button--sm ${hasActiveFilters ? 'button--primary' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="filter-badge">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="filters-panel">
              <div className="filters-panel__group">
                <label className="filters-panel__label">Category:</label>
                <select 
                  className="input input--sm" 
                  value={categoryFilter || 'all'} 
                  onChange={handleCategoryChange}
                >
                  <option value="all">All Categories</option>
                  {filterData?.categories?.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="filters-panel__group">
                <label className="filters-panel__label">Date Range:</label>
                <div className="date-range-inputs">
                  <input
                    type="date"
                    className="input input--sm"
                    value={dateRange.startDate || ''}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                  />
                  <span className="date-range-separator">to</span>
                  <input
                    type="date"
                    className="input input--sm"
                    value={dateRange.endDate || ''}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                  />
                  {(dateRange.startDate || dateRange.endDate) && (
                    <button 
                      className="icon-button icon-button--sm" 
                      onClick={clearDateRange}
                      title="Clear date range"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
              
              {hasActiveFilters && (
                <button
                  className="button button--ghost button--sm filters-panel__clear"
                  onClick={clearAllFilters}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="card__content">
        <div className="table-container">
          <table className="table">
            <thead className="table__header">
              <tr>
                <th 
                  className="table__header-cell table__header-cell--sortable"
                  onClick={() => toggleSort('date')}
                >
                  <span className="table__header-content">
                    Date
                    <ArrowUpDown 
                      size={14} 
                      className={`table__sort-icon ${sortBy.includes('date') ? 'table__sort-icon--active' : ''}`}
                    />
                  </span>
                </th>
                <th className="table__header-cell">Merchant</th>
                <th className="table__header-cell">Category</th>
                <th 
                  className="table__header-cell table__header-cell--sortable table__header-cell--right"
                  onClick={() => toggleSort('amount')}
                >
                  <span className="table__header-content">
                    Amount
                    <ArrowUpDown 
                      size={14} 
                      className={`table__sort-icon ${sortBy.includes('amount') ? 'table__sort-icon--active' : ''}`}
                    />
                  </span>
                </th>
                <th className="table__header-cell hide-mobile">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <tr key={i} className="table__row">
                    <td className="table__cell">
                      <div className="skeleton skeleton--text" style={{ width: '96px' }} />
                    </td>
                    <td className="table__cell">
                      <div className="skeleton skeleton--text" style={{ width: '128px' }} />
                    </td>
                    <td className="table__cell">
                      <div className="skeleton" style={{ width: '80px', height: '24px' }} />
                    </td>
                    <td className="table__cell table__cell--right">
                      <div className="skeleton skeleton--text" style={{ width: '80px' }} />
                    </td>
                    <td className="table__cell hide-mobile">
                      <div className="skeleton skeleton--text" style={{ width: '96px' }} />
                    </td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table__empty">
                    <div className="table__empty-content">
                      <ShoppingCart size={32} className="table__empty-icon" />
                      <p className="table__empty-text">
                        {hasActiveFilters 
                          ? 'No transactions found matching your filters' 
                          : 'No transactions found'}
                      </p>
                      {hasActiveFilters && (
                        <button 
                          className="button button--ghost button--sm"
                          onClick={clearAllFilters}
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => {
                  const IconComponent = iconMap[txn.icon] || ShoppingCart;
                  return (
                    <tr key={txn.id} className="table__row">
                      <td className="table__cell table__cell--muted">
                        {formatDate(txn.date, 'time')}
                      </td>
                      <td className="table__cell">
                        <div className="table__merchant">
                          <div 
                            className="table__merchant-icon"
                            style={{ backgroundColor: `${txn.categoryColor}15` }}
                          >
                            <IconComponent size={16} style={{ color: txn.categoryColor }} />
                          </div>
                          <div className="table__merchant-info">
                            <span className="table__merchant-name">{txn.merchant}</span>
                            <span className="table__merchant-desc">{txn.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="table__cell">
                        <span 
                          className="badge"
                          style={{ 
                            backgroundColor: `${txn.categoryColor}15`,
                            color: txn.categoryColor
                          }}
                        >
                          {txn.category}
                        </span>
                      </td>
                      <td className="table__cell table__cell--right">
                        <span className="transaction-amount">
                          -{formatCurrency(txn.amount)}
                        </span>
                      </td>
                      <td className="table__cell hide-mobile">
                        <div className="table__payment">
                          <CreditCard size={14} />
                          <span>{txn.paymentMethod}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {transactions.length > 0 && (
          <div className="pagination">
            <div className="pagination__info">
              Showing {page * ITEMS_PER_PAGE + 1} to {Math.min((page + 1) * ITEMS_PER_PAGE, pagination.total)} of {pagination.total} transactions
            </div>
            <div className="pagination__controls">
              <button
                className="button button--outline button--sm button--icon"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="pagination__page">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="button button--outline button--sm button--icon"
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasMore}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardProvider, useDashboard } from '../DashboardContext';

// Test component that uses the dashboard context
const TestComponent = () => {
  const { 
    selectedPeriod, 
    setSelectedPeriod, 
    categoryFilter, 
    setCategoryFilter,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    resetFilters 
  } = useDashboard();
  
  return (
    <div>
      <div data-testid="period">{selectedPeriod}</div>
      <div data-testid="category">{categoryFilter || 'none'}</div>
      <div data-testid="sortBy">{sortBy}</div>
      <div data-testid="startDate">{dateRange.startDate || 'none'}</div>
      <div data-testid="endDate">{dateRange.endDate || 'none'}</div>
      
      <button onClick={() => setSelectedPeriod('7d')}>Set 7D</button>
      <button onClick={() => setSelectedPeriod('90d')}>Set 90D</button>
      <button onClick={() => setCategoryFilter('Groceries')}>Set Groceries</button>
      <button onClick={() => setDateRange({ startDate: '2024-01-01', endDate: '2024-01-31' })}>Set Date Range</button>
      <button onClick={() => setSortBy('amount_desc')}>Sort Amount</button>
      <button onClick={resetFilters}>Reset</button>
    </div>
  );
};

describe('DashboardContext', () => {
  it('should have default values', () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );
    
    expect(screen.getByTestId('period')).toHaveTextContent('30d');
    expect(screen.getByTestId('category')).toHaveTextContent('none');
    expect(screen.getByTestId('sortBy')).toHaveTextContent('date_desc');
    expect(screen.getByTestId('startDate')).toHaveTextContent('none');
    expect(screen.getByTestId('endDate')).toHaveTextContent('none');
  });

  it('should update selected period', async () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );
    
    await userEvent.click(screen.getByText('Set 7D'));
    expect(screen.getByTestId('period')).toHaveTextContent('7d');
    
    await userEvent.click(screen.getByText('Set 90D'));
    expect(screen.getByTestId('period')).toHaveTextContent('90d');
  });

  it('should update category filter', async () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );
    
    await userEvent.click(screen.getByText('Set Groceries'));
    expect(screen.getByTestId('category')).toHaveTextContent('Groceries');
  });

  it('should update date range', async () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );
    
    await userEvent.click(screen.getByText('Set Date Range'));
    expect(screen.getByTestId('startDate')).toHaveTextContent('2024-01-01');
    expect(screen.getByTestId('endDate')).toHaveTextContent('2024-01-31');
  });

  it('should update sort order', async () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );
    
    await userEvent.click(screen.getByText('Sort Amount'));
    expect(screen.getByTestId('sortBy')).toHaveTextContent('amount_desc');
  });

  it('should reset all filters', async () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );
    
    // Set various filters
    await userEvent.click(screen.getByText('Set 7D'));
    await userEvent.click(screen.getByText('Set Groceries'));
    await userEvent.click(screen.getByText('Sort Amount'));
    
    // Reset
    await userEvent.click(screen.getByText('Reset'));
    
    expect(screen.getByTestId('period')).toHaveTextContent('30d');
    expect(screen.getByTestId('category')).toHaveTextContent('none');
    expect(screen.getByTestId('sortBy')).toHaveTextContent('date_desc');
  });

  it('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useDashboard must be used within a DashboardProvider');
    
    consoleError.mockRestore();
  });
});

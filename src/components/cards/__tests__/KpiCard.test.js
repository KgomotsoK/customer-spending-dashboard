import React from 'react';
import { render, screen } from '@testing-library/react';
import KpiCard from '../KpiCard';

// Mock the CSS import
jest.mock('../../../styles/main.css', () => ({}));

describe('KpiCard Component', () => {
  const mockIcon = () => <svg data-testid="mock-icon" />;

  it('should render with basic props', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25" 
      />
    );
    
    expect(screen.getByText('Total Spent')).toBeInTheDocument();
    expect(screen.getByText('R 32,890.25')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        icon={mockIcon}
      />
    );
    
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('should render positive change indicator', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        change={12.5}
        changeLabel="vs previous period"
      />
    );
    
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(screen.getByText('vs previous period')).toBeInTheDocument();
  });

  it('should render negative change indicator', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        change={-8.3}
        changeLabel="vs previous period"
      />
    );
    
    expect(screen.getByText('8.3%')).toBeInTheDocument();
  });

  it('should render loading skeleton', () => {
    const { container } = render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        loading={true}
      />
    );
    
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
    expect(screen.queryByText('Total Spent')).not.toBeInTheDocument();
  });

  it('should render with primary variant', () => {
    const { container } = render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        variant="primary"
      />
    );
    
    expect(container.querySelector('.kpi-card--primary')).toBeInTheDocument();
  });

  it('should handle zero change', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        change={0}
      />
    );
    
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import KpiCard from '../KpiCard';

// Mock CSS
jest.mock('../../../styles/main.css', () => ({}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <svg data-testid="trending-up">TrendingUp</svg>,
  TrendingDown: () => <svg data-testid="trending-down">TrendingDown</svg>
}));

describe('KpiCard Component', () => {
  const MockIcon = () => <svg data-testid="mock-icon">MockIcon</svg>;

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
        icon={MockIcon}
      />
    );
    
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('should render positive change indicator with trending up icon', () => {
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
    expect(screen.getByTestId('trending-up')).toBeInTheDocument();
    expect(screen.queryByTestId('trending-down')).not.toBeInTheDocument();
  });

  it('should render negative change indicator with trending down icon', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        change={-8.3}
        changeLabel="vs previous period"
      />
    );
    
    expect(screen.getByText('8.3%')).toBeInTheDocument();
    expect(screen.getByText('vs previous period')).toBeInTheDocument();
    expect(screen.getByTestId('trending-down')).toBeInTheDocument();
    expect(screen.queryByTestId('trending-up')).not.toBeInTheDocument();
  });

  it('should render loading skeleton', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        loading={true}
      />
    );
    
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
    expect(screen.queryByText('Total Spent')).not.toBeInTheDocument();
    expect(screen.queryByText('R 32,890.25')).not.toBeInTheDocument();
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

  it('should handle zero change with trending up icon', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        change={0}
      />
    );
    
    expect(screen.getByText('0.0%')).toBeInTheDocument();
    expect(screen.getByTestId('trending-up')).toBeInTheDocument();
  });

  it('should not render change section when change is undefined', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
      />
    );
    
    expect(screen.queryByText('%')).not.toBeInTheDocument();
    expect(screen.queryByTestId('trending-up')).not.toBeInTheDocument();
    expect(screen.queryByTestId('trending-down')).not.toBeInTheDocument();
  });

  it('should not render change label when not provided', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        change={12.5}
      />
    );
    
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(screen.queryByText('vs previous period')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes for positive/negative changes', () => {
    const { rerender, container } = render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        change={12.5}
      />
    );
    
    expect(container.querySelector('.kpi-card__change-badge--positive')).toBeInTheDocument();
    expect(container.querySelector('.kpi-card__change-badge--negative')).not.toBeInTheDocument();
    
    rerender(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        change={-8.3}
      />
    );
    
    expect(container.querySelector('.kpi-card__change-badge--positive')).not.toBeInTheDocument();
    expect(container.querySelector('.kpi-card__change-badge--negative')).toBeInTheDocument();
  });

  it('should format change value to one decimal place', () => {
    render(
      <KpiCard 
        title="Total Spent" 
        value="R 32,890.25"
        change={12.567} // Should round to 12.6
      />
    );
    
    expect(screen.getByText('12.6%')).toBeInTheDocument();
  });
});
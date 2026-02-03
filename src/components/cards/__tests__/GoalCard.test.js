import { render, screen } from '@testing-library/react';
import GoalCard from '../GoalCard';

// Mock CSS
jest.mock('../../../styles/main.css', () => ({}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  AlertTriangle: () => <svg data-testid="alert-triangle">AlertTriangle</svg>,
  CheckCircle2: () => <svg data-testid="check-circle">CheckCircle2</svg>,
  Clock: () => <svg data-testid="clock">Clock</svg>
}));

// Mock formatters
jest.mock('../../../utils/formatters', () => ({
  formatCurrency: (amount) => `R ${amount.toFixed(2)}`
}));

describe('GoalCard Component', () => {
  const mockGoalOnTrack = {
    id: 'goal_001',
    category: 'Entertainment',
    monthlyBudget: 3000,
    currentSpent: 1850,
    percentageUsed: 61.7,
    daysRemaining: 8,
    status: 'on_track'
  };

  const mockGoalWarning = {
    id: 'goal_002',
    category: 'Groceries',
    monthlyBudget: 10000,
    currentSpent: 8540.50,
    percentageUsed: 85.4,
    daysRemaining: 8,
    status: 'warning'
  };

  const mockGoalOverBudget = {
    id: 'goal_003',
    category: 'Dining',
    monthlyBudget: 3000,
    currentSpent: 3500,
    percentageUsed: 116.7,
    daysRemaining: 5,
    status: 'warning'
  };

  it('should render on-track goal correctly', () => {
    render(<GoalCard goal={mockGoalOnTrack} />);
    
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
    expect(screen.getByText('On Track')).toBeInTheDocument();
    expect(screen.getByText('8 days left')).toBeInTheDocument();
    expect(screen.getByText('62%')).toBeInTheDocument(); // rounded from 61.7
    expect(screen.getByText('R 1850.00')).toBeInTheDocument();
    expect(screen.getByText('R 1150.00 remaining')).toBeInTheDocument();
  });

  it('should render warning goal correctly', () => {
    render(<GoalCard goal={mockGoalWarning} />);
    
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument(); // rounded from 85.4
    expect(screen.getByText('R 8540.50')).toBeInTheDocument();
    expect(screen.getByText('R 1459.50 remaining')).toBeInTheDocument();
  });

  it('should render over-budget goal correctly', () => {
    render(<GoalCard goal={mockGoalOverBudget} />);
    
    expect(screen.getByText('Dining')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('117%')).toBeInTheDocument(); // rounded from 116.7
    expect(screen.getByText('R 3500.00')).toBeInTheDocument();
    expect(screen.getByText('Over budget by R 500.00')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(<GoalCard loading={true} />);
    
    // Check for skeleton elements (they don't have text content)
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
    
    // Verify no actual content is shown
    expect(screen.queryByText('Entertainment')).not.toBeInTheDocument();
    expect(screen.queryByText('On Track')).not.toBeInTheDocument();
  });

  it('should show correct icons based on status', () => {
    const { rerender } = render(<GoalCard goal={mockGoalOnTrack} />);
    
    expect(screen.getByTestId('check-circle')).toBeInTheDocument();
    expect(screen.queryByTestId('alert-triangle')).not.toBeInTheDocument();
    expect(screen.getByTestId('clock')).toBeInTheDocument();
    
    rerender(<GoalCard goal={mockGoalWarning} />);
    
    expect(screen.getByTestId('alert-triangle')).toBeInTheDocument();
    expect(screen.queryByTestId('check-circle')).not.toBeInTheDocument();
    expect(screen.getByTestId('clock')).toBeInTheDocument();
  });

  it('should calculate and display remaining amount correctly', () => {
    // Positive remaining
    const { rerender } = render(<GoalCard goal={mockGoalOnTrack} />);
    expect(screen.getByText('R 1150.00 remaining')).toBeInTheDocument();
    
    // Negative remaining (over budget)
    rerender(<GoalCard goal={mockGoalOverBudget} />);
    expect(screen.getByText('Over budget by R 500.00')).toBeInTheDocument();
  });

  it('should apply correct progress bar width', () => {
    render(<GoalCard goal={mockGoalOnTrack} />);
    
    const progressBar = document.querySelector('.goal-card__progress-bar');
    expect(progressBar).toHaveStyle('width: 61.7%');
  });

  it('should clamp progress bar width at 100%', () => {
    render(<GoalCard goal={mockGoalOverBudget} />);
    
    const progressBar = document.querySelector('.goal-card__progress-bar');
    expect(progressBar).toHaveStyle('width: 100%');
  });

  it('should apply warning classes when status is warning', () => {
    const { container } = render(<GoalCard goal={mockGoalWarning} />);
    
    expect(container.querySelector('.goal-card--warning')).toBeInTheDocument();
    expect(container.querySelector('.goal-card__status--warning')).toBeInTheDocument();
    expect(container.querySelector('.goal-card__percentage--warning')).toBeInTheDocument();
    expect(container.querySelector('.goal-card__progress-bar--warning')).toBeInTheDocument();
  });

  it('should not apply warning classes when on track', () => {
    const { container } = render(<GoalCard goal={mockGoalOnTrack} />);
    
    expect(container.querySelector('.goal-card--warning')).not.toBeInTheDocument();
    expect(container.querySelector('.goal-card__status--on-track')).toBeInTheDocument();
    expect(container.querySelector('.goal-card__percentage--on-track')).toBeInTheDocument();
    expect(container.querySelector('.goal-card__progress-bar--on-track')).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import GoalCard from '../GoalCard';

// Mock CSS
jest.mock('../../../styles/main.css', () => ({}));

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
    expect(screen.getByText('62%')).toBeInTheDocument();
  });

  it('should render warning goal correctly', () => {
    render(<GoalCard goal={mockGoalWarning} />);
    
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    const { container } = render(<GoalCard loading={true} />);
    
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
    expect(screen.queryByText('Entertainment')).not.toBeInTheDocument();
  });

  it('should apply warning class when status is warning', () => {
    const { container } = render(<GoalCard goal={mockGoalWarning} />);
    
    expect(container.querySelector('.goal-card--warning')).toBeInTheDocument();
  });

  it('should not apply warning class when on track', () => {
    const { container } = render(<GoalCard goal={mockGoalOnTrack} />);
    
    expect(container.querySelector('.goal-card--warning')).not.toBeInTheDocument();
  });
});

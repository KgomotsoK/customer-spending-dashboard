import { render, screen } from '@testing-library/react';
import CustomerHeader from '../CustomerHeader';

// Mock CSS
jest.mock('../../../styles/main.css', () => ({}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CalendarDays: () => <svg data-testid="calendar">CalendarDays</svg>,
  Wallet: () => <svg data-testid="wallet">Wallet</svg>
}));

// Mock formatters
jest.mock('../../../utils/formatters', () => ({
  formatCurrency: (amount) => `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  formatDate: (date, format) => {
    if (format === 'long') {
      return 'January 15, 2024';
    }
    return '2024-01-15';
  }
}));

describe('CustomerHeader Component', () => {
  const mockCustomer = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    accountType: 'Premium',
    joinDate: '2024-01-15',
    totalSpent: 32890.25
  };

  it('should render customer information correctly', () => {
    render(<CustomerHeader customer={mockCustomer} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@email.com')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Member since')).toBeInTheDocument();
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Total Spent')).toBeInTheDocument();
    expect(screen.getByText('R 32,890.25')).toBeInTheDocument();
  });

  it('should render loading skeleton', () => {
    render(<CustomerHeader loading={true} />);
    
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(4);
    
    // Verify no actual content is shown
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should generate initials from name', () => {
    render(<CustomerHeader customer={mockCustomer} />);
    
    expect(screen.getByText('JD')).toBeInTheDocument(); // John Doe -> TM
  });

  it('should handle customer with single name', () => {
    const singleNameCustomer = {
      name: 'John',
      email: 'John@email.com',
      accountType: 'Basic',
      joinDate: '2024-01-15',
      totalSpent: 1000
    };
    
    render(<CustomerHeader customer={singleNameCustomer} />);
    
    expect(screen.getByText('T')).toBeInTheDocument(); // John -> T
  });

  it('should handle customer with no name', () => {
    const noNameCustomer = {
      email: 'user@email.com',
      accountType: 'Basic',
      joinDate: '2024-01-15',
      totalSpent: 1000
      // No name property
    };
    
    render(<CustomerHeader customer={noNameCustomer} />);
    
    expect(screen.getByText('U')).toBeInTheDocument(); // Default to 'U'
  });

  it('should show correct icons', () => {
    render(<CustomerHeader customer={mockCustomer} />);
    
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
    expect(screen.getByTestId('wallet')).toBeInTheDocument();
  });

  it('should apply highlight class to total spent stat', () => {
    const { container } = render(<CustomerHeader customer={mockCustomer} />);
    
    const highlightedStat = container.querySelector('.customer-header__stat--highlight');
    expect(highlightedStat).toBeInTheDocument();
    expect(highlightedStat).toHaveTextContent('Total Spent');
    expect(highlightedStat).toHaveTextContent('R 32,890.25');
  });

  it('should format currency correctly', () => {
    const customerWithLargeAmount = {
      ...mockCustomer,
      totalSpent: 1234567.89
    };
    
    render(<CustomerHeader customer={customerWithLargeAmount} />);
    
    expect(screen.getByText('R 1,234,567.89')).toBeInTheDocument();
  });

  it('should format date in long format', () => {
    render(<CustomerHeader customer={mockCustomer} />);
    
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });

  it('should render without customer prop', () => {
    render(<CustomerHeader />);
    
    // Should show initials as 'U' when no customer
    expect(screen.getByText('U')).toBeInTheDocument();
    
    // Should not crash, but fields will be empty or show defaults
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should handle undefined customer properties gracefully', () => {
    const incompleteCustomer = {
      name: 'John Doe'
      // Missing other properties
    };
    
    render(<CustomerHeader customer={incompleteCustomer} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
    // Should render empty strings or defaults for missing fields
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });
});
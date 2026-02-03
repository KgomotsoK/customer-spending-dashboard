// Mock data for Customer Spending Insights API
// Follows the Capitec API specification

export const mockCustomerId = 'cust_12345';

export const customerProfile = {
  customerId: mockCustomerId,
  name: 'Thabo Mokoena',
  email: 'thabo.mokoena@email.co.za',
  joinDate: '2021-03-15',
  accountType: 'Premium',
  totalSpent: 187450.75,
  currency: 'ZAR'
};

export const getSpendingSummary = (period = '30d') => {
  const summaries = {
    '7d': {
      period: '7d',
      totalSpent: 8245.50,
      transactionCount: 23,
      averageTransaction: 358.50,
      topCategory: 'Groceries',
      comparedToPrevious: {
        spentChange: -12.5,
        transactionChange: -8.3
      }
    },
    '30d': {
      period: '30d',
      totalSpent: 32890.25,
      transactionCount: 87,
      averageTransaction: 378.05,
      topCategory: 'Groceries',
      comparedToPrevious: {
        spentChange: 5.8,
        transactionChange: 12.1
      }
    },
    '90d': {
      period: '90d',
      totalSpent: 98670.75,
      transactionCount: 256,
      averageTransaction: 385.43,
      topCategory: 'Utilities',
      comparedToPrevious: {
        spentChange: -3.2,
        transactionChange: 2.5
      }
    },
    '1y': {
      period: '1y',
      totalSpent: 187450.75,
      transactionCount: 892,
      averageTransaction: 210.15,
      topCategory: 'Groceries',
      comparedToPrevious: {
        spentChange: 15.3,
        transactionChange: 18.7
      }
    }
  };
  return summaries[period] || summaries['30d'];
};

export const getSpendingCategories = (period = '30d') => {
  const now = new Date();
  const startDate = new Date(now);
  
  const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
  startDate.setDate(startDate.getDate() - (daysMap[period] || 30));
  
  return {
    dateRange: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0]
    },
    totalAmount: 32890.25,
    categories: [
      {
        name: 'Groceries',
        amount: 8540.50,
        percentage: 26,
        transactionCount: 24,
        color: '#00A896',
        icon: 'shopping-cart'
      },
      {
        name: 'Utilities',
        amount: 6890.00,
        percentage: 21,
        transactionCount: 8,
        color: '#007BFF',
        icon: 'zap'
      },
      {
        name: 'Transport',
        amount: 5420.75,
        percentage: 16,
        transactionCount: 32,
        color: '#1E3A8A',
        icon: 'car'
      },
      {
        name: 'Entertainment',
        amount: 4250.00,
        percentage: 13,
        transactionCount: 12,
        color: '#F59E0B',
        icon: 'film'
      },
      {
        name: 'Dining',
        amount: 3890.50,
        percentage: 12,
        transactionCount: 18,
        color: '#EF4444',
        icon: 'utensils'
      },
      {
        name: 'Shopping',
        amount: 2450.25,
        percentage: 7,
        transactionCount: 8,
        color: '#8B5CF6',
        icon: 'shopping-bag'
      },
      {
        name: 'Healthcare',
        amount: 1448.25,
        percentage: 5,
        transactionCount: 5,
        color: '#10B981',
        icon: 'heart'
      }
    ]
  };
};

export const monthlyTrends = {
  trends: [
    { month: '2024-01', totalSpent: 14250.50, transactionCount: 68, averageTransaction: 209.56 },
    { month: '2024-02', totalSpent: 15890.25, transactionCount: 72, averageTransaction: 220.70 },
    { month: '2024-03', totalSpent: 13450.00, transactionCount: 65, averageTransaction: 206.92 },
    { month: '2024-04', totalSpent: 16780.75, transactionCount: 78, averageTransaction: 215.14 },
    { month: '2024-05', totalSpent: 15230.50, transactionCount: 71, averageTransaction: 214.51 },
    { month: '2024-06', totalSpent: 18920.25, transactionCount: 85, averageTransaction: 222.59 },
    { month: '2024-07', totalSpent: 14580.00, transactionCount: 69, averageTransaction: 211.30 },
    { month: '2024-08', totalSpent: 17340.75, transactionCount: 80, averageTransaction: 216.76 },
    { month: '2024-09', totalSpent: 16120.50, transactionCount: 75, averageTransaction: 214.94 },
    { month: '2024-10', totalSpent: 15670.25, transactionCount: 73, averageTransaction: 214.66 },
    { month: '2024-11', totalSpent: 18450.00, transactionCount: 82, averageTransaction: 225.00 },
    { month: '2024-12', totalSpent: 20768.00, transactionCount: 74, averageTransaction: 280.65 }
  ]
};

const merchants = [
  { name: 'Pick n Pay', category: 'Groceries', color: '#00A896', icon: 'shopping-cart' },
  { name: 'Woolworths', category: 'Groceries', color: '#00A896', icon: 'shopping-cart' },
  { name: 'Checkers', category: 'Groceries', color: '#00A896', icon: 'shopping-cart' },
  { name: 'Eskom', category: 'Utilities', color: '#007BFF', icon: 'zap' },
  { name: 'City Power', category: 'Utilities', color: '#007BFF', icon: 'zap' },
  { name: 'Gautrain', category: 'Transport', color: '#1E3A8A', icon: 'car' },
  { name: 'Uber', category: 'Transport', color: '#1E3A8A', icon: 'car' },
  { name: 'Shell', category: 'Transport', color: '#1E3A8A', icon: 'car' },
  { name: 'Netflix', category: 'Entertainment', color: '#F59E0B', icon: 'film' },
  { name: 'Showmax', category: 'Entertainment', color: '#F59E0B', icon: 'film' },
  { name: 'Ocean Basket', category: 'Dining', color: '#EF4444', icon: 'utensils' },
  { name: 'Nandos', category: 'Dining', color: '#EF4444', icon: 'utensils' },
  { name: 'Clicks', category: 'Healthcare', color: '#10B981', icon: 'heart' },
  { name: 'Dischem', category: 'Healthcare', color: '#10B981', icon: 'heart' },
  { name: 'Mr Price', category: 'Shopping', color: '#8B5CF6', icon: 'shopping-bag' },
  { name: 'Takealot', category: 'Shopping', color: '#8B5CF6', icon: 'shopping-bag' }
];

const paymentMethods = ['Debit Card', 'Credit Card', 'EFT', 'Instant Pay'];

// Generate realistic transactions
const generateTransactions = () => {
  const transactions = [];
  const now = new Date();
  
  for (let i = 0; i < 150; i++) {
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    date.setHours(Math.floor(Math.random() * 14) + 8);
    date.setMinutes(Math.floor(Math.random() * 60));
    
    let amount;
    switch (merchant.category) {
      case 'Groceries':
        amount = Math.random() * 800 + 150;
        break;
      case 'Utilities':
        amount = Math.random() * 1500 + 500;
        break;
      case 'Transport':
        amount = Math.random() * 300 + 50;
        break;
      case 'Entertainment':
        amount = Math.random() * 200 + 50;
        break;
      case 'Dining':
        amount = Math.random() * 400 + 100;
        break;
      case 'Healthcare':
        amount = Math.random() * 500 + 100;
        break;
      default:
        amount = Math.random() * 600 + 100;
    }
    
    transactions.push({
      id: `txn_${i.toString().padStart(5, '0')}`,
      date: date.toISOString(),
      merchant: merchant.name,
      category: merchant.category,
      amount: Math.round(amount * 100) / 100,
      description: `Payment at ${merchant.name}`,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      icon: merchant.icon,
      categoryColor: merchant.color
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const allTransactions = generateTransactions();

export const getTransactions = ({ limit = 20, offset = 0, category, startDate, endDate, sortBy = 'date_desc' }) => {
  let filtered = [...allTransactions];
  
  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }
  
  if (startDate) {
    filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
  }
  
  if (endDate) {
    filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate));
  }
  
  // Sorting
  switch (sortBy) {
    case 'date_asc':
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'date_desc':
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'amount_asc':
      filtered.sort((a, b) => a.amount - b.amount);
      break;
    case 'amount_desc':
      filtered.sort((a, b) => b.amount - a.amount);
      break;
    default:
      break;
  }
  
  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);
  
  return {
    transactions: paginated,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    }
  };
};

export const spendingGoals = {
  goals: [
    {
      id: 'goal_001',
      category: 'Groceries',
      monthlyBudget: 10000,
      currentSpent: 8540.50,
      percentageUsed: 85.4,
      daysRemaining: 8,
      status: 'warning'
    },
    {
      id: 'goal_002',
      category: 'Entertainment',
      monthlyBudget: 3000,
      currentSpent: 1850.00,
      percentageUsed: 61.7,
      daysRemaining: 8,
      status: 'on_track'
    },
    {
      id: 'goal_003',
      category: 'Dining',
      monthlyBudget: 4000,
      currentSpent: 3890.50,
      percentageUsed: 97.3,
      daysRemaining: 8,
      status: 'warning'
    },
    {
      id: 'goal_004',
      category: 'Transport',
      monthlyBudget: 6000,
      currentSpent: 3420.75,
      percentageUsed: 57.0,
      daysRemaining: 8,
      status: 'on_track'
    },
    {
      id: 'goal_005',
      category: 'Utilities',
      monthlyBudget: 8000,
      currentSpent: 6890.00,
      percentageUsed: 86.1,
      daysRemaining: 8,
      status: 'warning'
    }
  ]
};

export const filterOptions = {
  categories: [
    { name: 'Groceries', color: '#00A896', icon: 'shopping-cart' },
    { name: 'Utilities', color: '#007BFF', icon: 'zap' },
    { name: 'Transport', color: '#1E3A8A', icon: 'car' },
    { name: 'Entertainment', color: '#F59E0B', icon: 'film' },
    { name: 'Dining', color: '#EF4444', icon: 'utensils' },
    { name: 'Shopping', color: '#8B5CF6', icon: 'shopping-bag' },
    { name: 'Healthcare', color: '#10B981', icon: 'heart' }
  ],
  dateRangePresets: [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last year', value: '1y' }
  ]
};

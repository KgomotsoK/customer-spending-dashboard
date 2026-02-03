# Customer Spending Insights Dashboard

A production-grade banking dashboard for viewing and analyzing customer spending behavior, built in the style of Capitec's digital banking app.

## Project Overview

This project is a responsive financial analytics dashboard that displays customer spending data clearly, accurately, and intuitively. Features include:

- **User Authentication**: Mock authentication system with session persistence
- **Customer Overview**: Profile information with account type and total spending
- **Spending Summary**: KPIs with period comparisons (7D, 30D, 90D, 1Y)
- **Spending by Category**: Interactive doughnut chart with category breakdown
- **Monthly Spending Trends**: Line and bar chart visualizations
- **Transactions Table**: Sortable, filterable with date range picker and pagination
- **Spending Goals**: Budget tracking with status indicators

## Tech Stack

### Core
- **React 18** - UI library
- **JavaScript/JSX** - Programming language
- **Create React App** - Build tooling

### Styling
- **CSS3 with Semantic Classes** - No Tailwind, pure CSS with BEM-style naming
- **CSS Custom Properties** - Design system tokens for colors, spacing, etc.
- Clean, minimal, banking-grade UI

### Data & State
- **React Context** - Authentication and shared UI state

### Charts & Visualization
- **Chart.js** - Charting library
- **react-chartjs-2** - React wrapper for Chart.js

### Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- Unit tests for utilities, contexts, and components

### API Mocking
- **Static JSON Files** - Mock API endpoints served from `/api/`
- Simulates real API responses following the Capitec API specification

## Folder Structure

```
src/
├── api/
│   ├── apiClient.js         # API client for fetching data
│   ├── authService.js       # Authentication service (mock)
│   └── __tests__/           # API tests
├── components/
│   ├── cards/
│   │   ├── CustomerHeader.jsx
│   │   ├── GoalCard.jsx
│   │   ├── KpiCard.jsx
│   │   └── __tests__/
│   ├── charts/
│   │   ├── CategoryPieChart.jsx
│   │   └── TrendChart.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── PeriodSelector.jsx
│   └── tables/
│       └── TransactionsTable.jsx
├── context/
│   ├── AuthContext.js       # Authentication state management
│   ├── DashboardContext.js  # Dashboard filters state
│   └── __tests__/
├── hooks/
│   └── useApi.js            # TanStack Query hooks
├── pages/
│   ├── Dashboard.jsx
│   ├── LoginPage.jsx
│   └── __tests__/
├── styles/
│   └── main.css             # CSS3 design system
├── utils/
│   ├── formatters.js        # Currency, date formatting
│   └── __tests__/
├── App.js
└── index.js

public/
└── mock-api/
    └── customers/
        └── cust_12345/
            ├── profile.json
            ├── goals.json
            ├── filters.json
            ├── transactions.json
            └── spending/
                ├── summary.json
                ├── categories.json
                └── trends.json
```

## How to Run Locally

### Prerequisites
- Node.js 18+ 
- Yarn or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials
- Email: `john.doe@email.com`
- Password: `John@26`


## Running Tests

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test --coverage

# Run specific test file
yarn test src/api/__tests__/authService.test.js
```

## How to Run with Docker

### Build the Docker image:
```bash
docker build -t spending-insights-main .
```

### Run the container:
```bash
docker run -p 3000:3000 spending-insights-main
```

### Access the application:
Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints (Mocked via JSON)

| Endpoint | Description | JSON File |
|----------|-------------|-----------|
| Customer Profile | User information | `/mock-api/customers/cust_12345/profile.json` |
| Spending Summary | KPI data per period | `/mock-api/customers/cust_12345/spending/summary.json` |
| Spending Categories | Category breakdown | `/mock-api/customers/cust_12345/spending/categories.json` |
| Spending Trends | Monthly trends | `/mock-api/customers/cust_12345/spending/trends.json` |
| Transactions | Transaction list | `/mock-api/customers/cust_12345/transactions.json` |
| Spending Goals | Budget tracking | `/mock-api/customers/cust_12345/goals.json` |
| Filter Options | Categories list | `/mock-api/customers/cust_12345/filters.json` |

## Features

### Authentication
- Mock login system with localStorage persistence
- Session validation on app load
- Logout functionality
- Protected routes

### Period Switching
- Quick period selection: 7D, 30D, 90D, 1Y
- All data updates automatically based on selected period

### Date Range Filter
- Native HTML5 date inputs for transactions
- Filter by start and end date
- Clear button to reset filters

### Category Filter
- Dropdown to filter transactions by category
- Combined with date range for precise filtering

### Dark Mode
- Toggle between light and dark themes
- CSS custom properties for seamless switching

## CSS3 Design System

The application uses semantic CSS classes following BEM naming convention:

- `.button`, `.button--primary`, `.button--outline`
- `.card`, `.kpi-card`, `.goal-card`
- `.table`, `.table__header`, `.table__row`
- `.header`, `.header__brand`, `.header__actions`
- `.login-page`, `.login-card`, `.login-form`

CSS custom properties for theming:
- `--color-primary`: #2F70EF
- `--color-success`: #10B981
- `--color-warning`: #F59E0B
- `--color-destructive`: #EF4444

## Assumptions Made

1. **Mock Authentication**: Login uses mock user data (no real backend)
2. **Single Customer Data**: JSON files represent one customer (extendable)
3. **ZAR Currency**: All amounts in South African Rand
4. **South African Context**: Date/time formatting follows SA conventions
5. **Modern Browsers**: Assumes ES6+ support

## License

MIT License

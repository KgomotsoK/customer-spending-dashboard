// src/components/cards/CustomerHeader.jsx
import { CalendarDays, Wallet } from 'lucide-react';
import '../../styles/main.css';
import { formatCurrency, formatDate } from '../../utils/formatters';

const CustomerHeader = ({ customer, loading = false }) => {
  if (loading) {
    return (
      <div className="customer-header">
        <div className="customer-header__profile">
          <div className="skeleton skeleton--avatar" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="skeleton skeleton--title" style={{ width: '160px' }} />
            <div className="skeleton skeleton--text" style={{ width: '96px' }} />
          </div>
        </div>
        <div className="customer-header__stats">
          <div className="skeleton" style={{ width: '128px', height: '40px', borderRadius: 'var(--radius-lg)' }} />
          <div className="skeleton" style={{ width: '128px', height: '40px', borderRadius: 'var(--radius-lg)' }} />
        </div>
      </div>
    );
  }


  const initials = customer?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="customer-header" >
      <div className="customer-header__profile" >
        <div className="customer-header__avatar" >
          {initials}
        </div>
        <div className="customer-header__info">
          <h2>
            {customer?.name}
            <span className="customer-header__badge">{customer?.accountType}</span>
          </h2>
          <p>{customer?.email}</p>
        </div>
      </div>
      
      <div className="customer-header__stats">
        <div className="customer-header__stat">
          <CalendarDays className="customer-header__stat-icon" />
          <span className="customer-header__stat-label">Member since </span>
          <span className="customer-header__stat-value">
            {formatDate(customer?.joinDate, 'long')}
          </span>
        </div>
        
        <div className="customer-header__stat customer-header__stat--highlight">
          <Wallet className="customer-header__stat-icon" />
          <span className="customer-header__stat-label">Total Spent </span>
          <span className="customer-header__stat-value">
            {formatCurrency(customer?.totalSpent)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerHeader;

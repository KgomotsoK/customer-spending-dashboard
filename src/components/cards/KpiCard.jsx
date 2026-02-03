// src/components/cards/KpiCard.jsx
import { TrendingDown, TrendingUp } from 'lucide-react';
import '../../styles/main.css';

const KpiCard = ({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon: Icon,
  variant = 'default',
  loading = false 
}) => {
  const isPositive = change >= 0;
  
  if (loading) {
    return (
      <div className="kpi-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="skeleton skeleton--text" style={{ width: '96px' }} />
          <div className="skeleton skeleton--title" style={{ width: '128px' }} />
          <div className="skeleton skeleton--text" style={{ width: '80px' }} />
        </div>
      </div>
    );
  }

  const cardClass = variant === 'primary' ? 'kpi-card kpi-card--primary' : 'kpi-card';

  return (
    <div className={cardClass}>
      <div className="kpi-card__header">
        <div className="kpi-card__content">
          <p className="kpi-card__label">{title}</p>
          <p className="kpi-card__value">{value}</p>
        </div>
        {Icon && (
          <div className="kpi-card__icon">
            <Icon />
          </div>
        )}
      </div>
      
      {change !== undefined && (
        <div className="kpi-card__change">
          <span className={`kpi-card__change-badge ${isPositive ? 'kpi-card__change-badge--positive' : 'kpi-card__change-badge--negative'}`}>
            {isPositive ? <TrendingUp /> : <TrendingDown />}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </span>
          {changeLabel && (
            <span className="kpi-card__change-label">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default KpiCard;

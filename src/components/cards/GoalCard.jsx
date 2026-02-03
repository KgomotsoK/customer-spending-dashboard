// src/components/cards/GoalCard.jsx
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import '../../styles/main.css';
import { formatCurrency } from '../../utils/formatters';

const GoalCard = ({ goal, loading = false }) => {
  if (loading) {
    return (
      <div className="goal-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="skeleton skeleton--text" style={{ width: '96px' }} />
          <div className="skeleton skeleton--text" style={{ width: '100%', height: '8px' }} />
          <div className="skeleton skeleton--text" style={{ width: '128px' }} />
        </div>
      </div>
    );
  }

  const { category, monthlyBudget, currentSpent, percentageUsed, daysRemaining, status } = goal;
  const isWarning = status === 'warning';
  const remaining = monthlyBudget - currentSpent;
  const isOverBudget = remaining < 0;

  return (
    <div className={`goal-card ${isWarning ? 'goal-card--warning' : ''}`}>
      <div className="goal-card__header">
        <div className="goal-card__title">
          <span className="goal-card__category">{category}</span>
          <span className={`goal-card__status ${isWarning ? 'goal-card__status--warning' : 'goal-card__status--on-track'}`}>
            {isWarning ? <AlertTriangle /> : <CheckCircle2 />}
            <span>{isWarning ? 'Warning' : 'On Track'}</span>
          </span>
        </div>
        <div className="goal-card__days">
          <Clock />
          <span>{daysRemaining} days left</span>
        </div>
      </div>

      <div className="goal-card__amounts">
        <div>
          <span className="goal-card__spent">{formatCurrency(currentSpent)}</span>
          <span className="goal-card__budget">/ {formatCurrency(monthlyBudget)}</span>
        </div>
        <span className={`goal-card__percentage ${isWarning ? 'goal-card__percentage--warning' : 'goal-card__percentage--on-track'}`}>
          {percentageUsed.toFixed(0)}%
        </span>
      </div>
      
      <div className="goal-card__progress">
        <div 
          className={`goal-card__progress-bar ${isWarning ? 'goal-card__progress-bar--warning' : 'goal-card__progress-bar--on-track'}`}
          style={{ width: `${Math.min(percentageUsed, 100)}%` }}
        />
      </div>
      
      <p className={`goal-card__remaining ${isOverBudget ? 'goal-card__remaining--over' : ''}`}>
        {isOverBudget 
          ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
          : `${formatCurrency(remaining)} remaining`
        }
      </p>
    </div>
  );
};

export default GoalCard;

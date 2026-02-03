import { Calendar, Filter } from 'lucide-react';
import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import '../../styles/main.css';
import DateRangePicker from './DateRangePicker';

const PeriodSelector = ({ 
  selectedPeriod, 
  onPeriodChange, 
  availablePresets,
  loading = false 
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { dateRange, setDateRange } = useDashboard();

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range', icon: Calendar }
  ];

  const handlePeriodSelect = (periodValue) => {
    if (periodValue === 'custom') {
      setShowDatePicker(true);
    } else {
      onPeriodChange(periodValue);
      setDateRange({ startDate: null, endDate: null }); // Clear custom range when selecting preset
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (range.startDate && range.endDate) {
      onPeriodChange('custom');
    }
  };

  const hasCustomRange = dateRange.startDate && dateRange.endDate;

  if (loading) {
    return (
      <div className="tabs">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton" style={{ width: '80px', height: '36px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="period-selector">
      <div className="tabs">
        {periods.map(period => {
          const isActive = selectedPeriod === period.value || 
            (period.value === 'custom' && hasCustomRange);
          
          return (
            <button
              key={period.value}
              className={`tabs__trigger ${isActive ? 'tabs__trigger--active' : ''}`}
              onClick={() => handlePeriodSelect(period.value)}
              disabled={period.value === 'custom' && showDatePicker}
            >
              {period.icon && <period.icon size={14} />}
              {period.label}
            </button>
          );
        })}
      </div>

      {showDatePicker && (
        <div className="date-range-picker-container">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onClose={() => setShowDatePicker(false)}
          />
        </div>
      )}

      {hasCustomRange && (
        <div className="custom-range-display">
          <span className="custom-range__dates">
            {new Date(dateRange.startDate).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'short'
            })} - {new Date(dateRange.endDate).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          <button
            className="icon-button icon-button--sm"
            onClick={() => {
              setDateRange({ startDate: null, endDate: null });
              onPeriodChange('30d');
            }}
            title="Clear custom range"
          >
            <Filter size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;
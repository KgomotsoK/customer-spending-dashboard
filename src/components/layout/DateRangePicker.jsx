import { format } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import '../../styles/main.css';
import { formatDate } from '../../utils/formatters';

const DateRangePicker = ({ 
  dateRange, 
  onDateRangeChange, 
  onClose,
  className = '' 
}) => {
  const [tempRange, setTempRange] = useState({
    from: dateRange?.startDate ? new Date(dateRange.startDate) : null,
    to: dateRange?.endDate ? new Date(dateRange.endDate) : null
  });
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(tempRange.from || new Date());
  
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleDateClick = (date) => {
    if (!tempRange.from || (tempRange.from && tempRange.to)) {
      // Start new range
      setTempRange({ from: date, to: null });
    } else if (tempRange.from && !tempRange.to) {
      // Complete range
      if (date > tempRange.from) {
        setTempRange({ ...tempRange, to: date });
      } else {
        setTempRange({ from: date, to: tempRange.from });
      }
    }
  };

  const handleApply = () => {
    if (tempRange.from && tempRange.to) {
      onDateRangeChange({
        startDate: format(tempRange.from, 'yyyy-MM-dd'),
        endDate: format(tempRange.to, 'yyyy-MM-dd')
      });
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleClear = () => {
    setTempRange({ from: null, to: null });
    onDateRangeChange({ startDate: null, endDate: null });
    setIsOpen(false);
    onClose?.();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setViewDate(newDate);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add padding days from previous month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(firstDay);
      prevDate.setDate(prevDate.getDate() - (firstDayOfWeek - i));
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    return days;
  };

  const isDateInRange = (date) => {
    if (!tempRange.from) return false;
    if (tempRange.from && !tempRange.to) {
      return date.getTime() === tempRange.from.getTime();
    }
    return date >= tempRange.from && date <= tempRange.to;
  };

  const isDateStart = (date) => tempRange.from && date.getTime() === tempRange.from.getTime();
  const isDateEnd = (date) => tempRange.to && date.getTime() === tempRange.to.getTime();

  const days = getDaysInMonth(viewDate);
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={`date-range-picker ${className}`} ref={pickerRef}>
      <button
        className="date-range-picker__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={16} />
        <span>
          {dateRange?.startDate && dateRange?.endDate 
            ? `${formatDate(dateRange.startDate, 'short')} - ${formatDate(dateRange.endDate, 'short')}`
            : 'Select date range'
          }
        </span>
        {(dateRange?.startDate || dateRange?.endDate) && (
          <X 
            size={14} 
            className="date-range-picker__clear"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          />
        )}
      </button>

      {isOpen && (
        <div className="date-range-picker__popover">
          <div className="date-range-picker__header">
            <button 
              className="date-range-picker__nav-button"
              onClick={() => navigateMonth(-1)}
            >
              ‹
            </button>
            <div className="date-range-picker__month">
              {viewDate.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
            </div>
            <button 
              className="date-range-picker__nav-button"
              onClick={() => navigateMonth(1)}
            >
              ›
            </button>
          </div>

          <div className="date-range-picker__calendar">
            <div className="date-range-picker__weekdays">
              {weekDays.map(day => (
                <div key={day} className="date-range-picker__weekday">{day}</div>
              ))}
            </div>
            
            <div className="date-range-picker__days">
              {days.map(({ date, isCurrentMonth }, index) => {
                const isInRange = isDateInRange(date);
                const isStart = isDateStart(date);
                const isEnd = isDateEnd(date);
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <button
                    key={index}
                    className={`date-range-picker__day 
                      ${!isCurrentMonth ? 'date-range-picker__day--outside' : ''}
                      ${isInRange ? 'date-range-picker__day--in-range' : ''}
                      ${isStart ? 'date-range-picker__day--start' : ''}
                      ${isEnd ? 'date-range-picker__day--end' : ''}
                      ${isToday ? 'date-range-picker__day--today' : ''}
                    `}
                    onClick={() => isCurrentMonth && handleDateClick(date)}
                    disabled={!isCurrentMonth}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="date-range-picker__footer">
            <div className="date-range-picker__selected">
              {tempRange.from && (
                <div className="date-range-picker__selected-date">
                  <span>From:</span> {formatDate(tempRange.from, 'long')}
                </div>
              )}
              {tempRange.to && (
                <div className="date-range-picker__selected-date">
                  <span>To:</span> {formatDate(tempRange.to, 'long')}
                </div>
              )}
            </div>
            
            <div className="date-range-picker__actions">
              <button
                className="button button--ghost button--sm"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                className="button button--primary button--sm"
                onClick={handleApply}
                disabled={!tempRange.from || !tempRange.to}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

/**
 * Format currency in South African Rand
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the R symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  const formatted = new Intl.NumberFormat('en-ZA', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  
  return showSymbol ? `R ${formatted}` : formatted;
};

/**
 * Format date in a readable format
 * @param {string} dateString - ISO date string
 * @param {string} format - 'short', 'long', 'time'
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'short') => {
  const date = new Date(dateString);
  
  switch (format) {
    case 'long':
      return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return date.toLocaleString('en-ZA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'month':
      return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short'
      });
    case 'monthOnly':
      return date.toLocaleDateString('en-ZA', {
        month: 'short'
      });
    default:
      return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
  }
};

/**
 * Format percentage with optional sign
 * @param {number} value - The percentage value
 * @param {boolean} showSign - Whether to show + for positive numbers
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, showSign = false) => {
  const formatted = Math.abs(value).toFixed(1);
  if (showSign) {
    return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
  }
  return `${formatted}%`;
};

/**
 * Format number with compact notation for large numbers
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatCompactNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Get period label from period value
 * @param {string} period - Period value (7d, 30d, 90d, 1y)
 * @returns {string} Human readable label
 */
export const getPeriodLabel = (period) => {
  const labels = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    '1y': 'Last year'
  };
  return labels[period] || period;
};

/**
 * Parse month string to Date
 * @param {string} monthStr - Month string in YYYY-MM format
 * @returns {Date} Date object
 */
export const parseMonth = (monthStr) => {
  const [year, month] = monthStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1);
};

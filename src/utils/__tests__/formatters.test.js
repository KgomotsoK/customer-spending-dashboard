
import {
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatPercentage,
  getPeriodLabel,
  parseMonth
} from '../formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency with R symbol by default', () => {
      expect(formatCurrency(1234.56)).toBe('R 1,234.56');
    });

    it('should format currency without symbol when showSymbol is false', () => {
      expect(formatCurrency(1234.56, false)).toBe('1,234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('R 0.00');
      expect(formatCurrency(0, false)).toBe('0.00');
    });

    it('should handle large numbers with proper formatting', () => {
      expect(formatCurrency(1234567.89)).toBe('R 1,234,567.89');
      expect(formatCurrency(9876543.21, false)).toBe('9,876,543.21');
    });

    it('should handle decimal rounding correctly', () => {
      expect(formatCurrency(99.9)).toBe('R 99.90');
      expect(formatCurrency(99.994)).toBe('R 99.99');
      expect(formatCurrency(99.995)).toBe('R 100.00'); // Rounding
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-1234.56)).toBe('R -1,234.56');
      expect(formatCurrency(-0.01)).toBe('R -0.01');
    });

    it('should handle very small numbers', () => {
      expect(formatCurrency(0.001)).toBe('R 0.00');
      expect(formatCurrency(0.009)).toBe('R 0.01');
    });
  });

  describe('formatDate', () => {
    const testDate = '2024-06-15T14:30:00Z';

    beforeEach(() => {
      // Mock South African locale for consistent tests
      jest.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(function(locale, options) {
        if (locale === 'en-ZA') {
          if (options?.month === 'long') {
            return `15 June 2024`;
          }
          if (options?.month === 'short' && options?.day === 'numeric' && options?.hour === '2-digit') {
            return `15 Jun, 14:30`;
          }
          if (options?.month === 'short') {
            return `15 Jun 2024`;
          }
          if (options?.month === 'short' && !options?.year) {
            return `Jun`;
          }
        }
        return this.toString();
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should format date in default (short) format', () => {
      expect(formatDate(testDate)).toBe('15 Jun 2024');
    });

    it('should format date in long format', () => {
      expect(formatDate(testDate, 'long')).toBe('15 June 2024');
    });

    it('should format date with time', () => {
      expect(formatDate(testDate, 'time')).toBe('15 Jun, 14:30');
    });

    it('should format month only', () => {
      expect(formatDate(testDate, 'monthOnly')).toBe('Jun');
    });

    it('should format month with year', () => {
      expect(formatDate(testDate, 'month')).toBe('15 Jun 2024'); // Note: actual implementation returns month with day and year
    });

    it('should handle invalid date strings', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage without sign by default', () => {
      expect(formatPercentage(12.5)).toBe('12.5%');
      expect(formatPercentage(-12.5)).toBe('12.5%');
    });

    it('should format percentage with sign when showSign is true', () => {
      expect(formatPercentage(12.5, true)).toBe('+12.5%');
      expect(formatPercentage(-12.5, true)).toBe('-12.5%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.0%');
      expect(formatPercentage(0, true)).toBe('+0.0%');
    });

    it('should handle very small numbers', () => {
      expect(formatPercentage(0.123)).toBe('0.1%');
      expect(formatPercentage(0.987)).toBe('1.0%');
    });

    it('should handle large percentages', () => {
      expect(formatPercentage(123.456)).toBe('123.5%');
      expect(formatPercentage(999.999)).toBe('1000.0%');
    });

    it('should format to one decimal place', () => {
      expect(formatPercentage(12.567)).toBe('12.6%');
      expect(formatPercentage(12.511)).toBe('12.5%');
    });
  });

  describe('formatCompactNumber', () => {
    it('should format millions with one decimal place', () => {
      expect(formatCompactNumber(1500000)).toBe('1.5M');
      expect(formatCompactNumber(2000000)).toBe('2.0M');
      expect(formatCompactNumber(1234567)).toBe('1.2M');
      expect(formatCompactNumber(999999)).toBe('999,999'); // Just under 1M
    });

    it('should format thousands with one decimal place', () => {
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(2500)).toBe('2.5K');
      expect(formatCompactNumber(999)).toBe('999'); // Just under 1K
      expect(formatCompactNumber(1000)).toBe('1.0K');
    });

    it('should not format small numbers', () => {
      expect(formatCompactNumber(999)).toBe('999');
      expect(formatCompactNumber(0)).toBe('0');
      expect(formatCompactNumber(1)).toBe('1');
      expect(formatCompactNumber(500)).toBe('500');
    });

    it('should handle negative numbers', () => {
      expect(formatCompactNumber(-1500000)).toBe('-1.5M');
      expect(formatCompactNumber(-1500)).toBe('-1.5K');
      expect(formatCompactNumber(-500)).toBe('-500');
    });

    it('should handle decimal numbers', () => {
      expect(formatCompactNumber(1500.5)).toBe('1.5K');
      expect(formatCompactNumber(0.5)).toBe('0.5');
    });
  });

  describe('getPeriodLabel', () => {
    it('should return correct labels for known periods', () => {
      expect(getPeriodLabel('7d')).toBe('Last 7 days');
      expect(getPeriodLabel('30d')).toBe('Last 30 days');
      expect(getPeriodLabel('90d')).toBe('Last 90 days');
      expect(getPeriodLabel('1y')).toBe('Last year');
    });

    it('should return the input value for unknown periods', () => {
      expect(getPeriodLabel('unknown')).toBe('unknown');
      expect(getPeriodLabel('15d')).toBe('15d');
      expect(getPeriodLabel('')).toBe('');
      expect(getPeriodLabel(null)).toBe(null);
    });

    it('should handle edge cases', () => {
      expect(getPeriodLabel('7D')).toBe('7D'); // Case sensitive
      expect(getPeriodLabel('30')).toBe('30');
    });
  });

  describe('parseMonth', () => {
    it('should parse month string to Date object', () => {
      const date = parseMonth('2024-06');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(5); // June is month 5 (0-indexed)
      expect(date.getDate()).toBe(1); // Should default to first day of month
    });

    it('should parse January correctly', () => {
      const date = parseMonth('2024-01');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0); // January is month 0
    });

    it('should parse December correctly', () => {
      const date = parseMonth('2024-12');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(11); // December is month 11
    });

    it('should handle invalid month strings', () => {
      const date1 = parseMonth('2024-13'); // Invalid month
      expect(date1.toString()).toBe('Invalid Date');
      
      const date2 = parseMonth('invalid');
      expect(date2.toString()).toBe('Invalid Date');
    });

    it('should handle month with leading zero', () => {
      const date = parseMonth('2024-09');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(8); // September is month 8
    });
  });
});
import { 
  formatCurrency, 
  formatDate, 
  formatPercentage, 
  formatCompactNumber,
  getPeriodLabel,
  parseMonth 
} from '../formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency with R symbol', () => {
      expect(formatCurrency(1234.56)).toBe('R 1 234.56');
    });

    it('should format currency without symbol', () => {
      expect(formatCurrency(1234.56, false)).toBe('1 234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('R 0.00');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1234567.89)).toBe('R 1 234 567.89');
    });

    it('should handle decimals correctly', () => {
      expect(formatCurrency(99.9)).toBe('R 99.90');
      expect(formatCurrency(99.999)).toBe('R 100.00');
    });
  });

  describe('formatDate', () => {
    const testDate = '2024-06-15T14:30:00Z';

    it('should format date in short format', () => {
      const result = formatDate(testDate, 'short');
      expect(result).toMatch(/15.*Jun.*2024/i);
    });

    it('should format date in long format', () => {
      const result = formatDate(testDate, 'long');
      expect(result).toMatch(/15.*June.*2024/i);
    });

    it('should format date with time', () => {
      const result = formatDate(testDate, 'time');
      expect(result).toMatch(/Jun.*15/i);
    });

    it('should format month only', () => {
      const result = formatDate(testDate, 'monthOnly');
      expect(result).toMatch(/Jun/i);
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage without sign', () => {
      expect(formatPercentage(12.5)).toBe('12.5%');
      expect(formatPercentage(-12.5)).toBe('12.5%');
    });

    it('should format percentage with sign', () => {
      expect(formatPercentage(12.5, true)).toBe('+12.5%');
      expect(formatPercentage(-12.5, true)).toBe('-12.5%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.0%');
      expect(formatPercentage(0, true)).toBe('+0.0%');
    });
  });

  describe('formatCompactNumber', () => {
    it('should format millions', () => {
      expect(formatCompactNumber(1500000)).toBe('1.5M');
      expect(formatCompactNumber(2000000)).toBe('2.0M');
    });

    it('should format thousands', () => {
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(2500)).toBe('2.5K');
    });

    it('should not format small numbers', () => {
      expect(formatCompactNumber(999)).toBe('999');
      expect(formatCompactNumber(0)).toBe('0');
    });
  });

  describe('getPeriodLabel', () => {
    it('should return correct labels', () => {
      expect(getPeriodLabel('7d')).toBe('Last 7 days');
      expect(getPeriodLabel('30d')).toBe('Last 30 days');
      expect(getPeriodLabel('90d')).toBe('Last 90 days');
      expect(getPeriodLabel('1y')).toBe('Last year');
    });

    it('should return value for unknown period', () => {
      expect(getPeriodLabel('unknown')).toBe('unknown');
    });
  });

  describe('parseMonth', () => {
    it('should parse month string to Date', () => {
      const date = parseMonth('2024-06');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(5); // June is month 5 (0-indexed)
    });

    it('should parse January correctly', () => {
      const date = parseMonth('2024-01');
      expect(date.getMonth()).toBe(0);
    });

    it('should parse December correctly', () => {
      const date = parseMonth('2024-12');
      expect(date.getMonth()).toBe(11);
    });
  });
});

import { describe, expect, it } from 'vitest';
import { formatAmount, formatDate } from './formatters';

describe('formatAmount', () => {
  it('formats USD with currency symbol', () => {
    expect(formatAmount(9.99, 'USD')).toContain('$9.99');
  });

  it('formats EUR with currency symbol', () => {
    expect(formatAmount(19.99, 'EUR')).toContain('€19.99');
  });

  it('handles zero amount', () => {
    expect(formatAmount(0, 'USD')).toContain('$0.00');
  });

  it('preserves two decimal places', () => {
    expect(formatAmount(5, 'USD')).toContain('5.00');
  });
});

describe('formatDate', () => {
  // 2025-11-08T14:34:00Z is safe across timezones: UTC-12 through UTC+13
  // all land on Nov 8 (or Nov 9), keeping 'Nov' and '2025' in the output.
  const ISO = '2025-11-08T14:34:00Z';

  it('formats ISO date to readable string', () => {
    const result = formatDate(ISO);
    expect(result).toContain('Nov');
    expect(result).toContain('2025');
  });

  it('includes time', () => {
    expect(formatDate(ISO)).toContain(':');
  });
});

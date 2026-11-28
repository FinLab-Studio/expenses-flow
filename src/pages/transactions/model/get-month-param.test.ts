import { describe, expect, it } from 'vitest';
import { getMonthParam } from './get-month-param';

describe('getMonthParam', () => {
  it('returns the month from the address', () => {
    expect(getMonthParam('#/transactions?month=2026-10')).toBe('2026-10');
  });

  it('returns null when the address has no month', () => {
    expect(getMonthParam('#/transactions')).toBeNull();
  });

  it('returns null for a month that is not YYYY-MM', () => {
    expect(getMonthParam('#/transactions?month=abc')).toBeNull();
  });
});

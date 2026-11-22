import { describe, expect, it } from 'vitest';
import { formatMoney, formatSignedMoney } from './format-money';

describe('formatMoney', () => {
  it('uses a comma in de-DE', () => {
    expect(formatMoney(150000, 'de-DE')).toBe('1500,00');
  });

  it('uses a dot in en-US', () => {
    expect(formatMoney(1234598, 'en-US')).toBe('12345.98');
  });

  it('adds a minus to a negative amount', () => {
    expect(formatMoney(-243780, 'de-DE')).toBe('−2437,80');
  });
});

describe('formatSignedMoney', () => {
  it('adds a plus to a positive amount', () => {
    expect(formatSignedMoney(620000, 'de-DE')).toBe('+6200,00');
  });

  it('keeps the minus of a negative amount', () => {
    expect(formatSignedMoney(-243780, 'de-DE')).toBe('−2437,80');
  });
});

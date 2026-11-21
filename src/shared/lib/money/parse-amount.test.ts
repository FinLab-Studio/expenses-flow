import { describe, expect, it } from 'vitest';
import { parseAmount } from './parse-amount';

describe('parseAmount', () => {
  it('converts whole units to cents', () => {
    expect(parseAmount('12')).toBe(1200);
  });

  it('converts a one-digit fraction to cents', () => {
    expect(parseAmount('12,5')).toBe(1250);
  });
});

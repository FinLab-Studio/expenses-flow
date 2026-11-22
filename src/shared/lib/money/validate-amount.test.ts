import { describe, expect, it } from 'vitest';
import { AMOUNT_ERRORS, validateAmount } from './validate-amount';

describe('validateAmount', () => {
  it('returns null for a valid amount', () => {
    expect(validateAmount('12,50')).toBeNull();
  });

  it('rejects an empty input', () => {
    expect(validateAmount('')).toEqual({ message: AMOUNT_ERRORS.empty });
  });

  it('rejects letters', () => {
    expect(validateAmount('abc')).toEqual({ message: AMOUNT_ERRORS.invalidFormat });
  });

  it('rejects more than 2 decimal places', () => {
    expect(validateAmount('12,505')).toEqual({ message: AMOUNT_ERRORS.tooManyDecimals });
  });

  it('rejects zero', () => {
    expect(validateAmount('0')).toEqual({ message: AMOUNT_ERRORS.notPositive });
  });

  it('rejects an amount above the limit', () => {
    expect(validateAmount('2000000')).toEqual({ message: AMOUNT_ERRORS.tooLarge });
  });
});

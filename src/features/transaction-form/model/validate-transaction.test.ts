import { describe, expect, it } from 'vitest';
import { AMOUNT_ERRORS } from '@/shared/lib/money';
import type { TransactionFormValues } from './transaction-form-values.interface';
import { TRANSACTION_ERRORS, validateTransaction } from './validate-transaction';

// A valid form; each test breaks one field: { ...VALID, amount: '' }
const VALID: TransactionFormValues = {
  type: 'expenses',
  amount: '48,90',
  categoryId: '1006',
  date: '2026-11-17',
  description: '',
};

describe('validateTransaction', () => {
  it('returns null for a valid form', () => {
    expect(validateTransaction(VALID)).toBeNull();
  });

  it('returns the amount error from validateAmount', () => {
    expect(validateTransaction({ ...VALID, amount: '' })).toEqual({
      amount: { message: AMOUNT_ERRORS.empty },
    });
  });

  it('requires a category', () => {
    expect(validateTransaction({ ...VALID, categoryId: '' })).toEqual({
      categoryId: { message: TRANSACTION_ERRORS.noCategory },
    });
  });

  it('requires a date', () => {
    expect(validateTransaction({ ...VALID, date: '' })).toEqual({
      date: { message: TRANSACTION_ERRORS.noDate },
    });
  });
});

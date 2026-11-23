import { describe, expect, it } from 'vitest';
import { isTransactionsDTO } from './transactions-dto.validator';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';

const validTransaction: Transaction = {
  id: '2001',
  type: 'income',
  amount: 235000,
  categoryId: '1001',
  date: '2026-06-01',
  description: 'Monthly salary',
};

describe('isTransactionsDTO', () => {
  it('should return true for an array of valid transactions', () => {
    expect(isTransactionsDTO([validTransaction])).toBe(true);
  });

  it('should return true for an empty array', () => {
    expect(isTransactionsDTO([])).toBe(true);
  });

  it('should return false if the array contains an invalid transaction', () => {
    const invalidTransaction = { ...validTransaction, amount: -100 };

    expect(isTransactionsDTO([validTransaction, invalidTransaction])).toBe(false);
  });

  it('should return false for a non-array value', () => {
    expect(isTransactionsDTO(validTransaction)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isTransactionsDTO(null)).toBe(false);
  });
});

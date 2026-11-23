import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import { describe, expect, it } from 'vitest';
import { isTransaction } from './transaction.validator';
import { MAX_AMOUNT_CENTS } from '@/shared/lib/money';

const validTransaction: Transaction = {
  id: '2001',
  type: 'income',
  amount: 235000,
  categoryId: '1001',
  date: '2026-06-01',
  description: 'Monthly salary',
};

describe('isTransaction', () => {
  it('should return true for a valid transaction', () => {
    expect(isTransaction(validTransaction)).toBe(true);
  });

  it('should return true if description is missing', () => {
    const { description, ...transaction } = validTransaction;

    expect(isTransaction(transaction)).toBe(true);
  });

  it('should return true if description is an empty string', () => {
    const transaction = { ...validTransaction, description: '' };

    expect(isTransaction(transaction)).toBe(true);
  });

  it('should return false if id is missing', () => {
    const { id, ...transaction } = validTransaction;

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if id is empty', () => {
    const transaction = { ...validTransaction, id: '' };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if id contains only whitespace', () => {
    const transaction = { ...validTransaction, id: '   ' };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if type is invalid', () => {
    const transaction = { ...validTransaction, type: 'transfer' };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if amount is not a number', () => {
    const transaction = { ...validTransaction, amount: '2350' };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if amount is not an integer', () => {
    const transaction = { ...validTransaction, amount: 2350.5 };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if amount is zero', () => {
    const transaction = { ...validTransaction, amount: 0 };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if amount is negative', () => {
    const transaction = { ...validTransaction, amount: -100 };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if amount exceeds the maximum limit', () => {
    const transaction = {
      ...validTransaction,
      amount: MAX_AMOUNT_CENTS + 1,
    };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if categoryId is missing', () => {
    const { categoryId, ...transaction } = validTransaction;

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if categoryId is empty', () => {
    const transaction = { ...validTransaction, categoryId: '' };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if date is empty', () => {
    const transaction = { ...validTransaction, date: '' };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false if description is not a string', () => {
    const transaction = { ...validTransaction, description: 123 };

    expect(isTransaction(transaction)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isTransaction(null)).toBe(false);
  });

  it('should return false for an array', () => {
    expect(isTransaction([])).toBe(false);
  });

  it('should return false for a primitive', () => {
    expect(isTransaction('transaction')).toBe(false);
  });

  it('should reject a transaction with an invalid date format', () => {
    const transaction = {
      ...validTransaction,
      date: 'yesterday',
    };

    expect(isTransaction(transaction)).toBe(false);
  });
});

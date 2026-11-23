import { describe, expect, it } from 'vitest';

import { calculateBalance } from './calculate-balance';
import type { Transaction } from '../model/transaction.interface';

describe('calculateBalance', () => {
  it('should return zero balances when there are no transactions', () => {
    const result = calculateBalance([]);

    expect(result).toEqual({
      openingBalance: 0,
      periodChange: 0,
      closingBalance: 0,
    });
  });

  it('should add income amounts to the balance', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 100_000,
        categoryId: 'salary',
        date: '2026-11-01',
      },
      {
        id: '2',
        type: 'income',
        amount: 50_000,
        categoryId: 'freelance',
        date: '2026-11-02',
      },
    ];

    const result = calculateBalance(transactions);

    expect(result).toEqual({
      openingBalance: 0,
      periodChange: 150_000,
      closingBalance: 150_000,
    });
  });

  it('should subtract expense amounts from the balance', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'expenses',
        amount: 20_000,
        categoryId: 'food',
        date: '2026-11-01',
      },
      {
        id: '2',
        type: 'expenses',
        amount: 30_000,
        categoryId: 'transport',
        date: '2026-11-02',
      },
    ];

    const result = calculateBalance(transactions);

    expect(result).toEqual({
      openingBalance: 0,
      periodChange: -50_000,
      closingBalance: -50_000,
    });
  });

  it('should calculate balance from income and expenses', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 100_000,
        categoryId: 'salary',
        date: '2026-11-01',
      },
      {
        id: '2',
        type: 'expenses',
        amount: 20_000,
        categoryId: 'food',
        date: '2026-11-02',
      },
      {
        id: '3',
        type: 'income',
        amount: 50_000,
        categoryId: 'freelance',
        date: '2026-11-03',
      },
      {
        id: '4',
        type: 'expenses',
        amount: 30_000,
        categoryId: 'transport',
        date: '2026-11-04',
      },
    ];

    const result = calculateBalance(transactions);

    expect(result).toEqual({
      openingBalance: 0,
      periodChange: 100_000,
      closingBalance: 100_000,
    });
  });

  it('should calculate opening, period change and closing balances', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 100_000,
        categoryId: 'salary',
        date: '2026-10-25',
      },
      {
        id: '2',
        type: 'expenses',
        amount: 20_000,
        categoryId: 'food',
        date: '2026-11-01',
      },
      {
        id: '3',
        type: 'income',
        amount: 50_000,
        categoryId: 'freelance',
        date: '2026-11-10',
      },
      {
        id: '4',
        type: 'expenses',
        amount: 30_000,
        categoryId: 'transport',
        date: '2026-11-20',
      },
      {
        id: '5',
        type: 'income',
        amount: 40_000,
        categoryId: 'salary',
        date: '2026-12-01',
      },
    ];

    const result = calculateBalance(transactions, {
      startDate: '2026-11-01',
      endDate: '2026-11-30',
    });

    expect(result).toEqual({
      openingBalance: 100_000,
      periodChange: 0,
      closingBalance: 100_000,
    });
  });

  it('should include transactions on the start date', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 100_000,
        categoryId: 'salary',
        date: '2026-11-01',
      },
    ];

    const result = calculateBalance(transactions, {
      startDate: '2026-11-01',
      endDate: '2026-11-30',
    });

    expect(result).toEqual({
      openingBalance: 0,
      periodChange: 100_000,
      closingBalance: 100_000,
    });
  });

  it('should include transactions on the end date', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'expenses',
        amount: 25_000,
        categoryId: 'food',
        date: '2026-11-30',
      },
    ];

    const result = calculateBalance(transactions, {
      startDate: '2026-11-01',
      endDate: '2026-11-30',
    });

    expect(result).toEqual({
      openingBalance: 0,
      periodChange: -25_000,
      closingBalance: -25_000,
    });
  });

  it('should preserve opening balance when there are no transactions in the period', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 100_000,
        categoryId: 'salary',
        date: '2026-10-25',
      },
    ];

    const result = calculateBalance(transactions, {
      startDate: '2026-11-01',
      endDate: '2026-11-30',
    });

    expect(result).toEqual({
      openingBalance: 100_000,
      periodChange: 0,
      closingBalance: 100_000,
    });
  });

  it('should ignore transactions after the selected period', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 40_000,
        categoryId: 'salary',
        date: '2026-12-01',
      },
    ];

    const result = calculateBalance(transactions, {
      startDate: '2026-11-01',
      endDate: '2026-11-30',
    });

    expect(result).toEqual({
      openingBalance: 0,
      periodChange: 0,
      closingBalance: 0,
    });
  });

  it('should calculate balance when all transactions are outside the period', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 100_000,
        categoryId: 'salary',
        date: '2026-10-25',
      },
      {
        id: '2',
        type: 'income',
        amount: 50_000,
        categoryId: 'freelance',
        date: '2026-12-01',
      },
    ];

    const result = calculateBalance(transactions, {
      startDate: '2026-11-01',
      endDate: '2026-11-30',
    });

    expect(result).toEqual({
      openingBalance: 100_000,
      periodChange: 0,
      closingBalance: 100_000,
    });
  });

  it('should calculate balance for a single-day period', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 100_000,
        categoryId: 'salary',
        date: '2026-11-15',
      },
    ];

    const result = calculateBalance(transactions, {
      startDate: '2026-11-15',
      endDate: '2026-11-15',
    });

    expect(result).toEqual({
      openingBalance: 0,
      periodChange: 100_000,
      closingBalance: 100_000,
    });
  });

  it('should subtract expenses from the opening balance', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 100_000,
        categoryId: 'salary',
        date: '2026-10-25',
      },
      {
        id: '2',
        type: 'expenses',
        amount: 30_000,
        categoryId: 'food',
        date: '2026-10-28',
      },
    ];

    const result = calculateBalance(transactions, {
      startDate: '2026-11-01',
      endDate: '2026-11-30',
    });

    expect(result).toEqual({
      openingBalance: 70_000,
      periodChange: 0,
      closingBalance: 70_000,
    });
  });
});

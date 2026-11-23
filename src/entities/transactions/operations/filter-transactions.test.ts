import { describe, expect, it } from 'vitest';
import type { Transaction } from '../model/transaction.interface';
import { filterTransactions, type TransactionFilters } from './filter-transactions';

describe('filterTransactions', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 10000,
      categoryId: 'salary',
      date: '2026-11-10',
      description: 'Salary',
    },
    {
      id: '2',
      type: 'expenses',
      amount: 2500,
      categoryId: 'food',
      date: '2026-11-12',
      description: 'Groceries',
    },
    {
      id: '3',
      type: 'income',
      amount: 5000,
      categoryId: 'freelance',
      date: '2026-11-15',
    },
  ];
  it('should return all transactions when no filters are applied', () => {
    const filters: TransactionFilters = {
      type: 'expenses',
      categoryId: 'food',
      startDate: '2026-11-10',
      endDate: '2026-11-20',
    };

    const result = filterTransactions(transactions, filters, '2026-11-23');

    expect(result).toEqual([transactions[1]]);
  });

  it('should filter transactions by categoryId', () => {
    const filters: TransactionFilters = {
      type: 'all',
      categoryId: 'food',
    };

    const result = filterTransactions(transactions, filters, '2026-11-23');

    expect(result).toEqual([transactions[1]]);
  });

  it('should filter transactions by income type', () => {
    const filters: TransactionFilters = {
      type: 'income',
    };

    const result = filterTransactions(transactions, filters, '2026-11-23');

    expect(result).toEqual([transactions[0], transactions[2]]);
  });

  it('should filter transactions by expenses type', () => {
    const filters: TransactionFilters = {
      type: 'expenses',
    };

    const result = filterTransactions(transactions, filters, '2026-11-23');

    expect(result).toEqual([transactions[1]]);
  });

  it('should filter transactions by date range inclusively', () => {
    const filters: TransactionFilters = {
      type: 'all',
      startDate: '2026-11-12',
      endDate: '2026-11-15',
    };

    const result = filterTransactions(transactions, filters, '2026-11-23');

    expect(result).toEqual([transactions[1], transactions[2]]);
  });

  it('should use today as the end date when only startDate is provided', () => {
    const filters: TransactionFilters = {
      type: 'all',
      startDate: '2026-11-12',
    };

    const result = filterTransactions(transactions, filters, '2026-11-13');

    expect(result).toEqual([transactions[1]]);
  });

  it('should filter transactions up to endDate when startDate is not provided', () => {
    const filters: TransactionFilters = {
      type: 'all',
      endDate: '2026-11-12',
    };

    const result = filterTransactions(transactions, filters, '2026-11-23');

    expect(result).toEqual([transactions[0], transactions[1]]);
  });

  it('should include future transactions when no dates are provided', () => {
    const filters: TransactionFilters = {
      type: 'all',
    };

    const result = filterTransactions(transactions, filters, '2026-11-13');

    expect(result).toEqual(transactions);
  });

  it('should return an empty array when there are no transactions', () => {
    const filters: TransactionFilters = {
      type: 'all',
    };

    const result = filterTransactions([], filters, '2026-11-23');

    expect(result).toEqual([]);
  });

  it('should apply multiple filters simultaneously', () => {
    const filters: TransactionFilters = {
      type: 'expenses',
      categoryId: 'food',
      startDate: '2026-11-10',
      endDate: '2026-11-20',
    };

    const result = filterTransactions(transactions, filters, '2026-11-23');

    expect(result).toEqual([transactions[1]]);
  });

  // it('should apply search case-insensitively', () => {
  //   const filters: TransactionFilters = {
  //     type: 'all',
  //     search: 'salary',
  //   };

  //   const result = filterTransactions(transactions, filters, '2026-11-23');

  //   expect(result).toEqual([transactions[0]]);
  // });

  // it('should exclude transactions without description when search is applied', () => {
  //   const filters: TransactionFilters = {
  //     type: 'all',
  //     search: 'salary',
  //   };

  //   const result = filterTransactions(transactions, filters, '2026-11-23');

  //   expect(result).toEqual([transactions[0]]);
  // });

  // it('should return an empty array when search has no matches', () => {
  //   const filters: TransactionFilters = {
  //     type: 'all',
  //     search: 'Cinema City',
  //   };

  //   const result = filterTransactions(transactions, filters, '2026-11-23');

  //   expect(result).toEqual([]);
  // });
});

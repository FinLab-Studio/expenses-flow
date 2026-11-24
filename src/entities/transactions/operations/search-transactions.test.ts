import { describe, it, expect } from 'vitest';

import type { Transaction } from '../model/transaction.interface';
import { searchTransactions } from './search-transactions';
describe('searchTransactions', () => {
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

  it('should find transactions by description regardless of case', () => {
    const result = searchTransactions(transactions, 'salary');

    expect(result).toEqual([transactions[0]]);
  });

  it('should find transactions by a partial description match', () => {
    const result = searchTransactions(transactions, 'roceries');

    expect(result).toEqual([transactions[1]]);
  });

  it('should return all transactions when search term is empty', () => {
    const result = searchTransactions(transactions, '');

    expect(result).toEqual(transactions);
  });

  it('should trim whitespace from search term', () => {
    const result = searchTransactions(transactions, '  salary  ');

    expect(result).toEqual([transactions[0]]);
  });

  it('should return all transactions when search term contains only whitespace', () => {
    const result = searchTransactions(transactions, '   ');

    expect(result).toEqual(transactions);
  });

  it('should return an empty array when no transactions match', () => {
    const result = searchTransactions(transactions, 'rent');

    expect(result).toEqual([]);
  });

  it('should exclude transactions without description', () => {
    const result = searchTransactions([transactions[2]], 'freelance');

    expect(result).toEqual([]);
  });
});

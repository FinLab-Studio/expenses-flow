import { describe, it, expect } from 'vitest';
import type { Transaction } from '../model/transaction.interface';
import { sortNewestFirst } from './sort-newest-first';

function createTransaction(id: string, date: string): Transaction {
  return { id, type: 'expenses', amount: 1000, categoryId: '1006', date };
}

describe('sortNewestFirst', () => {
  it('puts the newest transactions first', () => {
    const transactions = [
      createTransaction('1', '2026-10-01'),
      createTransaction('2', '2026-10-28'),
      createTransaction('3', '2026-10-15'),
    ];

    expect(sortNewestFirst(transactions).map(({ id }) => id)).toEqual(['2', '3', '1']);
  });
});

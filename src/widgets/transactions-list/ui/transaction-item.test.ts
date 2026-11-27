// @vitest-environment happy-dom

import { describe, expect, it, vi } from 'vitest';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import { createTransactionItem } from './transaction-item';

const GROCERIES: Transaction = {
  id: 't1',
  type: 'expenses',
  amount: 14235,
  categoryId: '1006',
  date: '2026-11-16',
  description: 'Supermarket',
};

describe('createTransactionItem', () => {
  it('calls onEdit with the transaction when its Edit button is clicked', () => {
    const onEdit = vi.fn();
    const item = createTransactionItem({ transaction: GROCERIES, category: null, onEdit });

    item.querySelector<HTMLButtonElement>('[aria-label="Edit Supermarket"]')?.click();

    expect(onEdit).toHaveBeenCalledWith(GROCERIES);
  });

  it('has no Edit button without onEdit', () => {
    const item = createTransactionItem({ transaction: GROCERIES, category: null });

    expect(item.querySelector('button')).toBeNull();
  });
});

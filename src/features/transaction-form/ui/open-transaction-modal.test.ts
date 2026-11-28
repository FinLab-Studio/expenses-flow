// @vitest-environment happy-dom

import 'temporal-polyfill/global'; // as in app/main.ts: Node 22 has no Temporal
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Category } from '@/entities/category/model/category.interface';
import { transactionRepository } from '@/entities/transactions/api/transaction-repository';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import { TRANSACTION_ERRORS } from '../model/validate-transaction';
import { openTransactionModal } from './open-transaction-modal';

const FOOD: Category = { id: '1006', name: 'Food and groceries', color: 'amber', icon: 'cart' };

const RENT: Transaction = {
  id: 't1',
  type: 'expenses',
  amount: 120000,
  categoryId: '1006',
  date: '2026-11-03',
  description: 'Rent share',
};

// With the keys in localStorage the repositories don't load the demo data (no fetch in tests)
function seed(transactions: Transaction[]): void {
  localStorage.setItem('finlab.categories.income', JSON.stringify([]));
  localStorage.setItem('finlab.categories.expenses', JSON.stringify([FOOD]));
  localStorage.setItem('finlab.transactions', JSON.stringify(transactions));
}

function getInput(selector: string): HTMLInputElement {
  const input = document.querySelector<HTMLInputElement>(selector);

  if (!input) {
    throw new Error(`No input ${selector}`);
  }

  return input;
}

// Saving waits for the repository: wait one macrotask
async function submit(): Promise<void> {
  document.querySelector('form')?.requestSubmit();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('openTransactionModal', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.replaceChildren();
  });

  it('adds a transaction from the form, calls onSaved and closes', async () => {
    seed([]);
    const onSaved = vi.fn();

    await openTransactionModal({ onSaved });
    getInput('[name="amount"]').value = '48,90';
    // The dialog is in the document, so the click checks the radio as in a browser
    getInput('[name="categoryId"][value="1006"]').click();
    await submit();

    await expect(transactionRepository.getAll()).resolves.toEqual([
      expect.objectContaining({ type: 'expenses', amount: 4890, categoryId: '1006' }),
    ]);
    expect(onSaved).toHaveBeenCalledOnce();
    expect(document.querySelector('dialog')).toBeNull();
  });

  it('updates the transaction it was opened with', async () => {
    seed([RENT]);

    // Only the description changes: the other fields must come back from the form unchanged
    await openTransactionModal({ transaction: RENT, onSaved: () => {} });
    getInput('[name="description"]').value = 'Rent';
    await submit();

    await expect(transactionRepository.getAll()).resolves.toEqual([
      { ...RENT, description: 'Rent' },
    ]);
  });

  it('shows the errors and saves nothing while the form is invalid', async () => {
    seed([]);
    const onSaved = vi.fn();

    await openTransactionModal({ onSaved });
    await submit();

    expect(document.querySelector('#transaction-category-message')?.textContent).toBe(
      TRANSACTION_ERRORS.noCategory,
    );
    expect(onSaved).not.toHaveBeenCalled();
    expect(document.querySelector('dialog')?.open).toBe(true);
  });
});

import { createElement } from '@/shared/lib/dom/create-element';
import type { TransactionListOptions } from '../model/transaction-list-options.interface';
import { createTransactionItem } from './transaction-item';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';

interface TransactionListComponent {
  element: HTMLUListElement;
  update: (transactions: readonly Transaction[]) => void;
}

export function createTransactionList({
  transactions,
  categories,
}: TransactionListOptions): TransactionListComponent {
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  const element = createElement('ul', {
    classNames: 'transaction-list',
  });

  function update(transactions: readonly Transaction[]): void {
    if (transactions.length === 0) {
      const emptyState = createElement('li', {
        classNames: 'transaction-list__empty',
        textContent: 'No transactions found.',
      });

      element.replaceChildren(emptyState);
      return;
    }

    const items = transactions.map((transaction) => {
      const category = categoryMap.get(transaction.categoryId) ?? null;

      return createTransactionItem({ transaction, category });
    });

    element.replaceChildren(...items);
  }

  update(transactions);

  return { element, update };
}

import { createElement } from '@/shared/lib/dom/create-element';
import type { TransactionListOptions } from '../model/transaction-list-options.interface';
import { createTransactionItem } from './transaction-item';

export function createTransactionList({
  transactions,
  categories,
}: TransactionListOptions): HTMLUListElement {
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  const items = transactions.map((transaction) => {
    const category = categoryMap.get(transaction.categoryId) ?? null;

    return createTransactionItem({ transaction, category });
  });

  return createElement('ul', {
    classNames: 'transaction-list',
    children: items,
  });
}

import { createElement } from '@/shared/lib/dom/create-element';
import { createTransactionList } from '../transactions-list/ui/transaction-list';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import type { Category } from '@/entities/category/model/category.interface';

interface RecentTransactionsOptions {
  transactions: readonly Transaction[];
  categories: readonly Category[];
  month: Temporal.PlainYearMonth;
}

interface RecentTransactionsComponent {
  element: HTMLElement;
  updateMonth: (month: Temporal.PlainYearMonth) => void;
}

export function createRecentTransactions({
  transactions,
  categories,
  month,
}: RecentTransactionsOptions): RecentTransactionsComponent {
  const title = createElement('h2', {
    classNames: 'recent-transactions__title',
    textContent: 'Recent Transactions',
  });

  const viewAll = createElement('a', {
    classNames: 'recent-transactions__link',
    textContent: 'View all',
    attributes: {
      href: `#/transactions?month=${month.toString()}`,
    },
  });

  const header = createElement('div', {
    classNames: 'recent-transactions__header',
    children: [title, viewAll],
  });

  const element = createElement('section', {
    classNames: 'recent-transactions',
    children: [header],
  });

  const transactionList = createTransactionList({
    transactions: [],
    categories,
    showCategoryMarker: true,
    highlightIncome: true,
  });

  element.append(transactionList.element);

  function updateMonth(month: Temporal.PlainYearMonth): void {
    viewAll.setAttribute('href', `#/transactions?month=${month.toString()}`);
    const startDate = month.toPlainDate({ day: 1 }).toString();
    const endDate = month.toPlainDate({ day: month.daysInMonth }).toString();

    const recentTransactions = [...transactions]
      .filter(({ date }) => date >= startDate && date <= endDate)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);

    transactionList.update(recentTransactions);
  }

  updateMonth(month);

  return {
    element,
    updateMonth,
  };
}

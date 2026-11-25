import { createElement } from '@/shared/lib/dom/create-element';
import { createTransactionFilters } from '@/features/transaction-filters/ui/transaction-filters';
import { categoryRepository } from '@/entities/category/api/category-repository';
import { getInitialFiltersState } from '@/features/transaction-filters';

function createPageHeader(): HTMLElement {
  const title = createElement('h1', {
    textContent: 'Transactions',
  });

  const description = createElement('p', {
    textContent: 'History of your income and expenses.',
  });

  const heading = createElement('div', {
    classNames: 'transactions-page__heading',
    children: [title, description],
  });

  const addButton = createElement('button', {
    classNames: 'transactions-page__add-button',
    textContent: 'Add transaction',
    attributes: {
      type: 'button',
    },
  });

  return createElement('header', {
    classNames: 'transactions-page__header',
    children: [heading, addButton],
  });
}

export async function createTransactionsPage(): Promise<HTMLElement> {
  const categories = await categoryRepository.getAll();
  const filtersState = getInitialFiltersState();

  return createElement('main', {
    classNames: 'transactions-page',
    children: [createPageHeader(), createTransactionFilters(categories, filtersState)],
  });
}

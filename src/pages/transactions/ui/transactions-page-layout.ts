import { createElement } from '@/shared/lib/dom/create-element';
import { categoryRepository } from '@/entities/category/api/category-repository';
import { getInitialFiltersState } from '@/features/transaction-filters';
import { transactionRepository } from '@/entities/transactions/api/transaction-repository';
import { createTransactionList } from '@/widgets/transactions-list/ui/transaction-list';
import { filterTransactions } from '@/entities/transactions/operations/filter-transactions';
import { searchTransactions } from '@/entities/transactions/operations/search-transactions';
import { createTransactionControls } from '@/widgets/transaction-controls';
import { createBalanceSummary } from '@/widgets/balance-summary/ui/balance-summary';

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

export async function createTransactionsPageLayout(): Promise<HTMLElement> {
  const [categories, transactions] = await Promise.all([
    categoryRepository.getAll(),
    transactionRepository.getAll(),
  ]);

  const allCategories = [...categories.income, ...categories.expenses];

  const initialFiltersState = getInitialFiltersState();
  const today = Temporal.Now.plainDateISO().toString();

  const initialFilteredTransactions = filterTransactions(transactions, initialFiltersState, today);

  const transactionList = createTransactionList({
    transactions: initialFilteredTransactions,
    categories: allCategories,
  });

  const balanceSummary = createBalanceSummary({
    transactions,
    period: {
      startDate: initialFiltersState.startDate,
      endDate: initialFiltersState.endDate,
    },
  });

  const transactionControls = createTransactionControls({
    categories,
    initialState: initialFiltersState,
    onChange: (filtersState, searchTerm) => {
      const filteredByFilters = filterTransactions(transactions, filtersState, today);

      const filteredBySearch = searchTransactions(filteredByFilters, searchTerm);

      transactionList.update(filteredBySearch);

      balanceSummary.updatePeriod({
        startDate: filtersState.startDate,
        endDate: filtersState.endDate,
      });
    },
  });

  return createElement('main', {
    classNames: 'transactions-page',
    children: [
      createPageHeader(),
      transactionControls,
      balanceSummary.element,
      transactionList.element,
    ],
  });
}

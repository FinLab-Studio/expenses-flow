import { createElement } from '@/shared/lib/dom/create-element';
import { categoryRepository } from '@/entities/category/api/category-repository';
import { getInitialFiltersState } from '@/features/transaction-filters';
import { openTransactionModal } from '@/features/transaction-form';
import { transactionRepository } from '@/entities/transactions/api/transaction-repository';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import { createTransactionList } from '@/widgets/transactions-list/ui/transaction-list';
import { filterTransactions } from '@/entities/transactions/operations/filter-transactions';
import { searchTransactions } from '@/entities/transactions/operations/search-transactions';
import { createTransactionControls } from '@/widgets/transaction-controls';
import { createBalanceSummary } from '@/widgets/balance-summary/ui/balance-summary';
import { createPageHeader } from '@/widgets/page-header';

// The shared page header: title · currency chip · main action, as on the other pages.
function createHeader(onAdd: () => void): HTMLElement {
  const addButton = createElement('button', {
    classNames: 'button button--primary',
    textContent: 'Add transaction',
    attributes: { type: 'button' },
  });

  addButton.addEventListener('click', onAdd);

  return createPageHeader({
    title: 'Transactions',
    subtitle: 'History of your income and expenses.',
    action: addButton,
  });
}

export async function createTransactionsPageLayout(
  monthParam: string | null,
): Promise<HTMLElement> {
  const [categories, initialTransactions] = await Promise.all([
    categoryRepository.getAll(),
    transactionRepository.getAll(),
  ]);

  const allCategories = [...categories.income, ...categories.expenses];

  const currentMonth = Temporal.Now.plainDateISO().toPlainYearMonth();

  const selectedMonth = monthParam ? Temporal.PlainYearMonth.from(monthParam) : currentMonth;

  // Page state: read again after the modal saves a transaction (no separate store)
  let transactions = initialTransactions;
  let filtersState = getInitialFiltersState(selectedMonth);
  let searchTerm = '';

  const today = Temporal.Now.plainDateISO().toString();

  const transactionList = createTransactionList({
    transactions: filterTransactions(transactions, filtersState, today),
    categories: allCategories,
    onEdit: (transaction) => openModal(transaction),
  });

  let balanceSummary = createBalanceSummary({
    transactions,
    period: filtersState,
  });

  function showTransactions(): void {
    const filteredByFilters = filterTransactions(transactions, filtersState, today);

    const filteredBySearch = searchTransactions(filteredByFilters, searchTerm);

    transactionList.update(filteredBySearch);

    balanceSummary.updatePeriod(filtersState);
  }

  // After the modal saved: the new list with the same filters and search
  async function reload(): Promise<void> {
    transactions = await transactionRepository.getAll();

    // The summary keeps the list it was created with, so it is created again
    const nextSummary = createBalanceSummary({ transactions, period: filtersState });
    balanceSummary.element.replaceWith(nextSummary.element);
    balanceSummary = nextSummary;

    showTransactions();
  }

  // Without a transaction the modal adds a new one
  function openModal(transaction?: Transaction): void {
    void openTransactionModal({ transaction, onSaved: () => void reload() });
  }

  const transactionControls = createTransactionControls({
    categories,
    initialState: filtersState,
    onChange: (nextFiltersState, nextSearchTerm) => {
      filtersState = nextFiltersState;
      searchTerm = nextSearchTerm;

      showTransactions();
    },
  });

  return createElement('div', {
    classNames: 'transactions-page',
    children: [
      createHeader(() => openModal()),
      transactionControls,
      balanceSummary.element,
      transactionList.element,
    ],
  });
}

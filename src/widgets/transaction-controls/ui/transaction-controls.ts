import type { CategoriesDTO } from '@/entities/category/model/categories.dto';
import type { TransactionFiltersState } from '@/features/transaction-filters';
import { createTransactionFilters } from '@/features/transaction-filters/ui/transaction-filters';
import { createTransactionSearchField } from '@/features/transaction-search-field/ui/transaction-search-field';
import { createElement } from '@/shared/lib/dom/create-element';

interface TransactionControlsOptions {
  categories: CategoriesDTO;
  initialState: TransactionFiltersState;
  onChange: (filtersState: TransactionFiltersState, searchTerm: string) => void;
}

export function createTransactionControls({
  categories,
  initialState,
  onChange,
}: TransactionControlsOptions): HTMLElement {
  let filtersState = { ...initialState };
  let searchTerm = '';

  const filters = createTransactionFilters({
    categories,
    state: filtersState,
    onChange: (nextFiltersState) => {
      filtersState = nextFiltersState;
      onChange(filtersState, searchTerm);
    },
  });

  const searchField = createTransactionSearchField({
    onSearch: (nextSearchTerm) => {
      searchTerm = nextSearchTerm;
      onChange(filtersState, searchTerm);
    },
  });

  return createElement('div', {
    classNames: 'transaction-controls',
    children: [filters, searchField],
  });
}

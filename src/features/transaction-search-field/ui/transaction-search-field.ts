import { debounce } from '@/shared/lib/debounce/debounce';
import { createElement } from '@/shared/lib/dom/create-element';

interface TransactionSearchFieldOptions {
  onSearch: (searchTerm: string) => void;
}

export function createTransactionSearchField({
  onSearch,
}: TransactionSearchFieldOptions): HTMLElement {
  const label = createElement('label', {
    classNames: 'transaction-search-field__label',
    textContent: 'Search in description',
    attributes: {
      for: 'searchbar',
    },
  });

  const input = createElement('input', {
    classNames: 'transaction-search-field__input',
    attributes: {
      id: 'searchbar',
      type: 'search',
      placeholder: 'Start typing description',
    },
  });

  const resetButton = createElement('button', {
    classNames: 'transaction-search-field__reset',
    textContent: 'Reset',
    attributes: {
      type: 'button',
    },
  });

  resetButton.addEventListener('click', () => {
    input.value = '';
    handleSearch(input.value);
  });

  const controls = createElement('div', {
    classNames: 'transaction-search-field__controls',
    children: [input, resetButton],
  });

  const handleSearch = debounce((searchTerm: string) => {
    onSearch(searchTerm);
  }, 300);

  input.addEventListener('input', () => {
    handleSearch(input.value);
  });

  return createElement('div', {
    classNames: 'transaction-search-field',
    children: [label, controls],
  });
}

import type { Category } from '@/entities/category/model/category.interface';
import { createDropdown } from '@/shared/components/dropdown/ui/dropdown';
import { createElement } from '@/shared/lib/dom/create-element';
import type { TransactionFiltersState } from '../model/transaction-filters-state.interface';
import type { CategoriesDTO } from '@/entities/category/model/categories.dto';
import type { TransactionType } from '@/shared/types/transaction-type.type';
import { createDatePicker } from '@/shared/components/date-picker/ui/date-picker';

interface FilterComponent {
  element: HTMLElement;
  update: (state: TransactionFiltersState) => void;
}

type FilterUpdate = Partial<TransactionFiltersState>;

interface TransactionFiltersOptions {
  categories: CategoriesDTO;
  state: TransactionFiltersState;
  onChange: (state: TransactionFiltersState) => void;
}

function createFilterLabel(text: string): HTMLElement {
  return createElement('span', {
    classNames: 'transaction-filters__label',
    textContent: text,
  });
}

export function createTransactionFilters({
  categories,
  state,
  onChange,
}: TransactionFiltersOptions): HTMLElement {
  let filtersState = { ...state };

  const dateFilter = createDateFilters(filtersState, (updates) => {
    filtersState = {
      ...filtersState,
      ...updates,
    };

    onChange(filtersState);
  });

  const categoryFilter = createCategoryFilter(categories, filtersState, (updates) => {
    filtersState = {
      ...filtersState,
      ...updates,
    };

    onChange(filtersState);
  });

  const typeFilter = createTypeFilter(filtersState, (updates) => {
    filtersState = {
      ...filtersState,
      ...updates,
    };

    typeFilter.update(filtersState);
    categoryFilter.update(filtersState);
    onChange(filtersState);
  });

  const filtersContentContainer = createElement('div', {
    classNames: 'transaction-filters__content',
    children: [dateFilter.element, typeFilter.element, categoryFilter.element],
  });

  return createElement('section', {
    classNames: 'transactions-page__filters',
    attributes: {
      'aria-label': 'Transaction filters',
    },
    children: [filtersContentContainer],
  });
}

function createDateFilters(
  initialState: TransactionFiltersState,
  onChange: (updates: FilterUpdate) => void,
): FilterComponent {
  let currentState = { ...initialState };

  let isRangeCalendarOpen = false;

  const datesContainer = createElement('div', {
    classNames: 'transaction-filters__dates',
  });

  const dateFieldsContainer = createElement('div', {
    classNames: 'transaction-filters__date-fields',
  });

  const startDateFieldContainer = createElement('div', {
    classNames: 'transaction-filters__date-field-container',
  });

  const endDateFieldContainer = createElement('div', {
    classNames: 'transaction-filters__date-field-container',
  });

  const startDateField = createElement('button', {
    classNames: 'transaction-filters__date-field',
    attributes: {
      type: 'button',
      'aria-label': 'Choose start date',
    },
  });

  const endDateField = createElement('button', {
    classNames: 'transaction-filters__date-field',
    attributes: {
      type: 'button',
      'aria-label': 'Choose end date',
    },
  });

  const dateTrigger = createElement('button', {
    classNames: 'transaction-filters__date-trigger',
    attributes: {
      type: 'button',
      'aria-expanded': 'false',
      'aria-label': 'Choose date range',
    },
  });

  const dateCalendarContainer = createElement('div', {
    classNames: 'transaction-filters__date-calendar',
  });

  const startCalendarContainer = createElement('div', {
    classNames:
      'transaction-filters__date-calendar-item transaction-filters__date-calendar-item--start',
  });

  const endCalendarContainer = createElement('div', {
    classNames:
      'transaction-filters__date-calendar-item transaction-filters__date-calendar-item--end',
  });

  const applyDatesButton = createElement('button', {
    classNames: 'transaction-filters__date-apply',
    textContent: 'Apply',
    attributes: {
      type: 'button',
    },
  });

  let activeCalendar: 'start' | 'end' | null = null;

  function toggleCalendar(calendar: 'start' | 'end'): void {
    isRangeCalendarOpen = false;
    activeCalendar = activeCalendar === calendar ? null : calendar;

    startCalendarContainer.hidden = activeCalendar !== 'start';
    endCalendarContainer.hidden = activeCalendar !== 'end';

    dateTrigger.setAttribute('aria-expanded', 'false');
  }

  function openRangeCalendar(): void {
    isRangeCalendarOpen = true;
    activeCalendar = null;

    startCalendarContainer.hidden = false;
    endCalendarContainer.hidden = false;

    dateTrigger.setAttribute('aria-expanded', 'true');
    datesContainer.classList.add('transaction-filters__dates--range-open');
  }

  function closeRangeCalendar(): void {
    isRangeCalendarOpen = false;
    activeCalendar = null;

    startCalendarContainer.hidden = true;
    endCalendarContainer.hidden = true;

    dateTrigger.setAttribute('aria-expanded', 'false');
    datesContainer.classList.remove('transaction-filters__dates--range-open');
  }

  startDateField.addEventListener('click', () => {
    toggleCalendar('start');
  });

  endDateField.addEventListener('click', () => {
    toggleCalendar('end');
  });

  dateTrigger.addEventListener('click', () => {
    if (isRangeCalendarOpen) {
      closeRangeCalendar();
    } else {
      openRangeCalendar();
    }
  });

  applyDatesButton.addEventListener('click', closeRangeCalendar);

  function formatDate(date: string): string {
    return Temporal.PlainDate.from(date).toLocaleString('en', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function renderDateLabels(): void {
    startDateField.replaceChildren(
      createElement('span', {
        textContent: formatDate(currentState.startDate),
      }),
      createElement('span', {
        textContent: '📅',
        attributes: {
          'aria-hidden': 'true',
        },
      }),
    );

    endDateField.replaceChildren(
      createElement('span', {
        textContent: formatDate(currentState.endDate),
      }),
      createElement('span', {
        textContent: '📅',
        attributes: {
          'aria-hidden': 'true',
        },
      }),
    );

    dateTrigger.textContent = `${formatDate(currentState.startDate)} – ${formatDate(currentState.endDate)}`;
  }

  function renderStartDatePicker(): void {
    const datePicker = createDatePicker({
      label: 'Start date',
      value: currentState.startDate,
      onSelect: (date) => {
        const shouldUpdateEndDate =
          Temporal.PlainDate.compare(
            Temporal.PlainDate.from(date),
            Temporal.PlainDate.from(currentState.endDate),
          ) > 0;

        currentState = {
          ...currentState,
          startDate: date,
          endDate: shouldUpdateEndDate ? date : currentState.endDate,
        };

        renderDateLabels();

        if (!isRangeCalendarOpen) {
          toggleCalendar('start');
        }

        if (shouldUpdateEndDate) {
          renderEndDatePicker();
        }

        onChange({
          startDate: currentState.startDate,
          endDate: currentState.endDate,
        });
      },
    });

    startCalendarContainer.replaceChildren(datePicker);
  }

  function renderEndDatePicker(): void {
    const datePicker = createDatePicker({
      label: 'End date',
      value: currentState.endDate,
      onSelect: (date) => {
        const shouldUpdateStartDate =
          Temporal.PlainDate.compare(
            Temporal.PlainDate.from(date),
            Temporal.PlainDate.from(currentState.startDate),
          ) < 0;

        currentState = {
          ...currentState,
          startDate: shouldUpdateStartDate ? date : currentState.startDate,
          endDate: date,
        };

        renderDateLabels();
        if (!isRangeCalendarOpen) {
          toggleCalendar('end');
        }

        if (shouldUpdateStartDate) {
          renderStartDatePicker();
        }

        onChange({
          startDate: currentState.startDate,
          endDate: currentState.endDate,
        });
      },
    });

    endCalendarContainer.replaceChildren(datePicker);
  }

  startDateFieldContainer.append(createFilterLabel('From'), startDateField);

  endDateFieldContainer.append(createFilterLabel('To'), endDateField);

  dateFieldsContainer.append(startDateFieldContainer, endDateFieldContainer);

  dateCalendarContainer.append(startCalendarContainer, endCalendarContainer);

  datesContainer.append(dateFieldsContainer, dateTrigger, dateCalendarContainer, applyDatesButton);

  renderDateLabels();
  renderStartDatePicker();
  renderEndDatePicker();
  startCalendarContainer.hidden = true;
  endCalendarContainer.hidden = true;

  return {
    element: datesContainer,
    update: (state) => {
      currentState = { ...state };

      renderDateLabels();
      renderStartDatePicker();
      renderEndDatePicker();
    },
  };
}

function createTypeFilter(
  initialState: TransactionFiltersState,
  onChange: (updates: FilterUpdate) => void,
): FilterComponent {
  const typeContainer = createElement('div', {
    classNames: 'transaction-filters__type',
  });

  const typeOptions = [
    createElement('li', {
      children: [
        createElement('button', {
          textContent: 'All types',
          attributes: {
            type: 'button',
            'data-value': 'all',
          },
        }),
      ],
    }),
    createElement('li', {
      children: [
        createElement('button', {
          textContent: 'Income',
          attributes: {
            type: 'button',
            'data-value': 'income',
          },
        }),
      ],
    }),
    createElement('li', {
      children: [
        createElement('button', {
          textContent: 'Expenses',
          attributes: {
            type: 'button',
            'data-value': 'expenses',
          },
        }),
      ],
    }),
  ];

  const typeLabels = {
    all: 'All types',
    income: 'Income',
    expenses: 'Expenses',
  } satisfies Record<TransactionFiltersState['type'], string>;

  function render(state: TransactionFiltersState): void {
    const typeDropdown = createDropdown({
      label: 'Filter by type',
      value: typeLabels[state.type],
      content: typeOptions,
      onSelect: (value) => {
        if (!isTransactionType(value) && value !== 'all') {
          return;
        }

        onChange({
          type: value,
          categoryId: null,
        });
      },
    });

    typeContainer.replaceChildren(createFilterLabel('Type'), typeDropdown);
  }

  render(initialState);

  return {
    element: typeContainer,
    update: render,
  };
}

function createCategoryFilter(
  categories: CategoriesDTO,
  initialState: TransactionFiltersState,
  onChange: (updates: FilterUpdate) => void,
): FilterComponent {
  const categoryContainer = createElement('div', {
    classNames: 'transaction-filters__category',
  });

  const categoryLabels = {
    all: 'All Categories',
    income: 'All Income',
    expenses: 'All Expenses',
  } satisfies Record<TransactionFiltersState['type'], string>;

  function render(state: TransactionFiltersState): void {
    const categoryDropdown = createDropdown({
      label: 'Filter by category',
      value:
        state.categoryId === null
          ? categoryLabels[state.type]
          : (getCategoryName(categories, state.categoryId) ?? categoryLabels[state.type]),
      content: createCategoryOptions(categories, state.type),
      onSelect: (value) => {
        onChange({
          categoryId: value || null,
        });
      },
    });

    categoryContainer.replaceChildren(createFilterLabel('Category'), categoryDropdown);
  }

  render(initialState);

  return {
    element: categoryContainer,
    update: render,
  };
}

function isTransactionType(value: string): value is TransactionType {
  return value === 'income' || value === 'expenses';
}

function getCategoryName(categories: CategoriesDTO, categoryId: string): string | undefined {
  const allCategories = [...categories.income, ...categories.expenses];

  return allCategories.find((category) => category.id === categoryId)?.name;
}

function createCategoryGroup(
  title: string,
  categories: Category[],
  showTitle = true,
): HTMLLIElement {
  const categoryItems = categories.map((category) =>
    createElement('li', {
      children: [
        createElement('button', {
          textContent: category.name,
          attributes: {
            type: 'button',
            'data-value': category.id,
          },
        }),
      ],
    }),
  );

  return createElement('li', {
    children: [
      ...(showTitle
        ? [
            createElement('strong', {
              textContent: title,
            }),
          ]
        : []),
      createElement('ul', {
        attributes: {
          role: 'list',
        },
        children: categoryItems,
      }),
    ],
  });
}

function createCategoryOptions(
  categories: CategoriesDTO,
  type: TransactionFiltersState['type'],
): HTMLLIElement[] {
  const options: HTMLLIElement[] = [
    createElement('li', {
      children: [
        createElement('button', {
          textContent:
            type === 'all' ? 'All Categories' : type === 'income' ? 'All Income' : 'All Expenses',
          attributes: {
            type: 'button',
            'data-value': '',
          },
        }),
      ],
    }),
  ];

  if (type === 'all') {
    options.push(createCategoryGroup('Income', categories.income));
    options.push(createCategoryGroup('Expenses', categories.expenses));
  }

  if (type === 'income') {
    options.push(createCategoryGroup('Income', categories.income, false));
  }

  if (type === 'expenses') {
    options.push(createCategoryGroup('Expenses', categories.expenses, false));
  }

  return options;
}

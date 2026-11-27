import type { TransactionFiltersState } from '../model/transaction-filters-state.interface';

export function getInitialFiltersState(month: Temporal.PlainYearMonth): TransactionFiltersState {
  return {
    startDate: month.toPlainDate({ day: 1 }).toString(),
    endDate: month.toPlainDate({ day: month.daysInMonth }).toString(),
    categoryId: null,
    type: 'all',
  };
}

import type { TransactionFiltersState } from '../model/transaction-filters-state.interface';

export function getInitialFiltersState(): TransactionFiltersState {
  const today = Temporal.Now.plainDateISO();

  return {
    startDate: today.with({ day: 1 }).toString(),
    endDate: today.with({ day: today.daysInMonth }).toString(),
    categoryId: null,
    type: 'all',
  };
}

import type { TransactionFilters } from '@/entities/transactions/model/transaction-filters.interface';
import type { TransactionFiltersState } from './transaction-filters-state.interface';

export function mapFiltersState(state: TransactionFiltersState): TransactionFilters {
  const { startDate, endDate, categoryId, type } = state;

  return {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(categoryId && { categoryId }),
    type,
  };
}

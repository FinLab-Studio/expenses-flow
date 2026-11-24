import type { TransactionType } from '@/shared/types/transaction-type.type';
import type { Transaction } from '../model/transaction.interface';

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type: 'all' | TransactionType;
}

export function filterTransactions(
  transactions: readonly Transaction[],
  filters: TransactionFilters,
  today: string,
): Transaction[] {
  let result = [...transactions];

  if (filters.categoryId) {
    result = result.filter((transaction) => transaction.categoryId === filters.categoryId);
  }

  if (filters.type !== 'all') {
    result = result.filter((transaction) => transaction.type === filters.type);
  }

  const { startDate, endDate } = filters;

  if (startDate) {
    result = result.filter((transaction) => transaction.date >= startDate);
  }

  if (endDate || startDate) {
    const upperDate = endDate ?? today;

    result = result.filter((transaction) => transaction.date <= upperDate);
  }

  return result;
}

import type { Transaction } from '../model/transaction.interface';
import type { TransactionFilters } from '../model/transaction-filters.interface';

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

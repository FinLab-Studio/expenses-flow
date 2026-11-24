import type { Transaction } from '../model/transaction.interface';

export function searchTransactions(
  transactions: readonly Transaction[],
  searchTerm: string,
): Transaction[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return [...transactions];
  }

  return transactions.filter(
    (transaction) => transaction.description?.toLowerCase().includes(normalizedSearch) ?? false,
  );
}

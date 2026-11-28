import type { Transaction } from '../model/transaction.interface';

/**
 * Newest first, as in the Transactions artboard and in Recent transactions on the Dashboard.
 * 'YYYY-MM-DD' strings compare like dates. Returns a copy: the input array stays as it is.
 * Transactions of the same day keep their order (Array.prototype.sort is stable).
 */
export function sortNewestFirst(transactions: readonly Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
}

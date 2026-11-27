import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import { parseAmount } from '@/shared/lib/money';
import type { TransactionFormValues } from './transaction-form-values.interface';

/**
 * Turns form values into a transaction without id (the repository creates it):
 * the amount in cents, the description trimmed and left out when empty.
 * Call it only after validateTransaction() returned null.
 */
export function toTransactionDraft(values: TransactionFormValues): Omit<Transaction, 'id'> {
  const draft: Omit<Transaction, 'id'> = {
    type: values.type,
    amount: parseAmount(values.amount),
    categoryId: values.categoryId,
    date: values.date,
  };

  const description = values.description.trim();

  if (description) {
    draft.description = description;
  }

  return draft;
}

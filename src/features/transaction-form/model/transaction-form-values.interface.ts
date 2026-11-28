import type { TransactionType } from '@/shared/types/transaction-type.type';

// What the transaction form holds: the fields as the user filled them in.
// validateTransaction checks them, toTransactionDraft turns them into a transaction.
export interface TransactionFormValues {
  type: TransactionType;
  amount: string; // as typed: '12,50' or '12.50'
  categoryId: string; // '' until a category is chosen
  date: string; // 'YYYY-MM-DD'; '' while the date field is empty
  description: string; // optional: may be ''
}

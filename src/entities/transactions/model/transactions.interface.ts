import type { TransactionType } from '../../../shared/types/transaction-type.type';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
}

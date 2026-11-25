import type { Category } from '@/entities/category/model/category.interface';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';

export interface TransactionItemOptions {
  transaction: Transaction;
  category: Category | null;
}

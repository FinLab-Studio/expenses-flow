import type { Category } from '@/entities/category/model/category.interface';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';

export interface TransactionListOptions {
  transactions: Transaction[];
  categories: Category[];
  onEdit?: (transaction: Transaction) => void; // with it, every row gets an Edit button
}

import type { Category } from '@/entities/category/model/category.interface';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';

export interface TransactionListOptions {
  transactions: readonly Transaction[];
  categories: readonly Category[];
  showCategoryMarker?: boolean;
  highlightIncome?: boolean;
}

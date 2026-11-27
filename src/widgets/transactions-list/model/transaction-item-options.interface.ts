import type { Category } from '@/entities/category/model/category.interface';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';

export interface TransactionItemOptions {
  transaction: Transaction;
  category: Category | null;
  showCategoryMarker?: boolean;
  highlightIncome?: boolean;
  onEdit?: (transaction: Transaction) => void; // with it, the row gets an Edit button
}

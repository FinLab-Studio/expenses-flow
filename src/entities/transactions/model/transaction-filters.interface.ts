import type { TransactionType } from '@/shared/types/transaction-type.type';

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type: 'all' | TransactionType;
}

import type { TransactionsDTO } from '../model/transactions-dto.type';
import { isTransaction } from './transaction.validator';

export function isTransactionsDTO(value: unknown): value is TransactionsDTO {
  return Array.isArray(value) && value.every(isTransaction);
}

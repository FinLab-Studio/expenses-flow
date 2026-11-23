import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import { MAX_AMOUNT_CENTS } from '@/shared/lib/money';
import type { TransactionType } from '@/shared/types/transaction-type.type';
import { isNonEmptyString } from '@/shared/utils/is-non-empty-string';

function isTransactionType(value: unknown): value is TransactionType {
  return value === 'income' || value === 'expenses';
}

export function isTransaction(value: unknown): value is Transaction {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'id' in value &&
    isNonEmptyString(value.id) &&
    'type' in value &&
    isTransactionType(value.type) &&
    'amount' in value &&
    typeof value.amount === 'number' &&
    Number.isInteger(value.amount) &&
    value.amount > 0 &&
    value.amount <= MAX_AMOUNT_CENTS &&
    'categoryId' in value &&
    isNonEmptyString(value.categoryId) &&
    'date' in value &&
    isNonEmptyString(value.date) &&
    (!('description' in value) || typeof value.description === 'string')
  );
}

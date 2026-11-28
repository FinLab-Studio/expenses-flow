import { validateAmount } from '@/shared/lib/money';
import type { TransactionFormErrors } from './transaction-form-errors.interface';
import type { TransactionFormValues } from './transaction-form-values.interface';

export const TRANSACTION_ERRORS = {
  noCategory: 'Choose a category',
  noDate: 'Choose a date',
} as const;

/**
 * Checks the transaction form, like a form group validator in Angular:
 * null — the form can be saved; otherwise an error for every field with a problem.
 * The amount is checked by validateAmount. Type and description need no check:
 * the type comes from two radio buttons, the description is optional.
 */
export function validateTransaction(values: TransactionFormValues): TransactionFormErrors | null {
  const errors: TransactionFormErrors = {};

  const amountError = validateAmount(values.amount);

  if (amountError) {
    errors.amount = amountError;
  }

  if (!values.categoryId) {
    errors.categoryId = { message: TRANSACTION_ERRORS.noCategory };
  }

  // <input type="date"> gives '' or a real date, so an empty value is the only problem
  if (!values.date) {
    errors.date = { message: TRANSACTION_ERRORS.noDate };
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

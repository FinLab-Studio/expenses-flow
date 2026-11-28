import type { ValidationError } from '@/shared/types/validation-error.interface';

// One error per field with a problem; fields without errors are left out.
// Keys match TransactionFormValues, so the form finds the field by the key.
export interface TransactionFormErrors {
  amount?: ValidationError;
  categoryId?: ValidationError;
  date?: ValidationError;
}

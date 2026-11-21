import type { ValidationError } from '@/shared/types/validation-error.interface';
import { parseAmount } from './parse-amount';

export const MAX_AMOUNT_CENTS = 100_000_000;

export const AMOUNT_ERRORS = {
  empty: 'Enter an amount',
  invalidFormat: 'Use digits and one comma or dot, for example 12,50',
  tooManyDecimals: 'Use at most 2 decimal places, for example 12,50',
  notPositive: 'Amount must be greater than 0',
  tooLarge: 'Amount is too large, the limit is 1000000,00',
} as const;

const AMOUNT_PATTERN = /^\d+([.,]\d+)?$/;

export function validateAmount(input: string): ValidationError | null {
  if (!input) {
    return { message: AMOUNT_ERRORS.empty };
  }

  if (!AMOUNT_PATTERN.test(input)) {
    return { message: AMOUNT_ERRORS.invalidFormat };
  }

  const [, fraction = ''] = input.split(/[.,]/);

  if (fraction.length > 2) {
    return { message: AMOUNT_ERRORS.tooManyDecimals };
  }

  const cents = parseAmount(input);

  if (cents <= 0) {
    return { message: AMOUNT_ERRORS.notPositive };
  }

  if (cents > MAX_AMOUNT_CENTS) {
    return { message: AMOUNT_ERRORS.tooLarge };
  }

  return null;
}

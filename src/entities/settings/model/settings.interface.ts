import type { CurrencyCode } from '@/shared/types/currency-code.type';

export interface Settings {
  currency: CurrencyCode;
  currencyLocked: boolean; // true after the user first leaves the About page
}

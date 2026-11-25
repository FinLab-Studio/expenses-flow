import { createElement } from '@/shared/lib/dom/create-element';
import type { CurrencyCode } from '@/shared/types/currency-code.type';

// The current currency as a small non-interactive pill: in every page header and on About
// once the currency is locked. Screen readers hear "Currency: EUR".
export function createCurrencyChip(currency: CurrencyCode): HTMLElement {
  return createElement('span', {
    classNames: 'currency-chip',
    attributes: { title: `All amounts are in ${currency}` },
    children: [
      createElement('span', { classNames: 'visually-hidden', textContent: 'Currency: ' }),
      document.createTextNode(currency),
    ],
  });
}

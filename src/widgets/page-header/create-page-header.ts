import { createElement } from '@/shared/lib/dom/create-element';

export interface PageHeaderOptions {
  title: string;
  subtitle: string;
  controls?: HTMLElement; // left of the currency chip: the month switcher on Dashboard
  action?: HTMLElement; // right of the chip: the main action, Add transaction on Transactions
}

// Page header: title and subtitle on the left; controls · currency chip · action on the right.
export function createPageHeader({
  title,
  subtitle,
  controls,
  action,
}: PageHeaderOptions): HTMLElement {
  const heading = createElement('div', {
    classNames: 'page-header__heading',
    children: [
      createElement('h1', { textContent: title }),
      createElement('p', { classNames: 'page-header__subtitle', textContent: subtitle }),
    ],
  });

  const parts = [controls, createCurrencyChip(), action].filter((part) => part !== undefined);

  return createElement('header', {
    classNames: 'page-header',
    children: [heading, ...parts],
  });
}

// The place for the currency chip. Static EUR (the default currency) until the currency
// settings task: then it shows Settings.currency, and pages do not change.
function createCurrencyChip(): HTMLElement {
  return createElement('span', {
    classNames: 'currency-chip',
    attributes: { title: 'All amounts are in EUR' },
    children: [
      createElement('span', { classNames: 'visually-hidden', textContent: 'Currency: ' }),
      document.createTextNode('EUR'),
    ],
  });
}

import { settingsRepository } from '@/entities/settings/api/settings-repository';
import { DEFAULT_SETTINGS } from '@/entities/settings/model/default-settings';
import { createCurrencyChip } from '@/entities/settings/ui/create-currency-chip';
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

  const parts = [controls, createSavedCurrencyChip(), action].filter((part) => part !== undefined);

  return createElement('header', {
    classNames: 'page-header',
    children: [heading, ...parts],
  });
}

// The header is synchronous and the repository is not, so pages don't have to change:
// the chip starts with the default currency and is replaced with the saved one once
// Settings load. With localStorage that happens before the first paint (no flicker).
function createSavedCurrencyChip(): HTMLElement {
  const chip = createCurrencyChip(DEFAULT_SETTINGS.currency);

  void settingsRepository.get().then(({ currency }) => {
    chip.replaceWith(createCurrencyChip(currency));
  });

  return chip;
}

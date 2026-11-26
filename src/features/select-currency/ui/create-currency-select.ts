import { settingsRepository } from '@/entities/settings/api/settings-repository';
import type { Settings } from '@/entities/settings/model/settings.interface';
import { createCurrencyChip } from '@/entities/settings/ui/create-currency-chip';
import { createElement } from '@/shared/lib/dom/create-element';
import type { CurrencyCode } from '@/shared/types/currency-code.type';

const CURRENCIES: readonly CurrencyCode[] = ['EUR', 'USD', 'PLN'];

// One select per page (in the About hero), so fixed ids are enough.
const LABEL_ID = 'currency-select-label';
const HINT_ID = 'currency-select-hint';

const OPEN_HINT = 'EUR by default. You can change it while on this page; it locks when you leave.';
const LOCKED_HINT = 'Chosen on your first visit. It can’t be changed.';

// "Your currency" on About: a segmented switcher EUR / USD / PLN while the currency is open,
// the currency chip once it is locked (lockCurrency runs when the user leaves About).
export function createCurrencySelect(settings: Settings): HTMLElement {
  const label = createElement('span', {
    classNames: 'currency-select__label',
    textContent: 'Your currency',
    attributes: { id: LABEL_ID },
  });

  const control = settings.currencyLocked
    ? createCurrencyChip(settings.currency)
    : createSwitcher(settings);

  const hint = createElement('p', {
    classNames: 'currency-select__hint',
    textContent: settings.currencyLocked ? LOCKED_HINT : OPEN_HINT,
    attributes: { id: HINT_ID },
  });

  return createElement('div', { classNames: 'currency-select', children: [label, control, hint] });
}

// Native radio buttons: the browser gives the group semantics, one Tab stop and arrow keys.
// The inputs are visually hidden; the labels look like segments (styles/components/_segmented.scss).
function createSwitcher(settings: Settings): HTMLElement {
  return createElement('div', {
    classNames: 'segmented',
    attributes: { role: 'radiogroup', 'aria-labelledby': LABEL_ID, 'aria-describedby': HINT_ID },
    children: CURRENCIES.map((currency) => createOption(currency, settings)),
  });
}

function createOption(currency: CurrencyCode, settings: Settings): HTMLLabelElement {
  const input = createElement('input', {
    classNames: 'visually-hidden',
    attributes: {
      type: 'radio',
      name: 'currency',
      value: currency,
      checked: currency === settings.currency,
    },
  });

  // Saved right away: the user can leave About through the sidebar at any moment.
  input.addEventListener('change', () => {
    void settingsRepository.save({ ...settings, currency });
  });

  return createElement('label', {
    classNames: 'segmented__option',
    children: [input, document.createTextNode(currency)],
  });
}

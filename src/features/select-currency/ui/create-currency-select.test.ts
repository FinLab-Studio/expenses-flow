// @vitest-environment happy-dom

import { settingsRepository } from '@/entities/settings/api/settings-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { createCurrencySelect } from './create-currency-select';

describe('createCurrencySelect', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.replaceChildren();
  });

  it('saves the currency the user picks', async () => {
    const select = createCurrencySelect({ currency: 'EUR', currencyLocked: false });
    // As in a browser, a click fires `change` only on an input that is in the document.
    document.body.append(select);

    select.querySelector<HTMLInputElement>('input[value="USD"]')?.click();

    await expect(settingsRepository.get()).resolves.toEqual({
      currency: 'USD',
      currencyLocked: false,
    });
  });

  it('shows the currency chip instead of the switcher when the currency is locked', () => {
    const select = createCurrencySelect({ currency: 'PLN', currencyLocked: true });

    expect(select.querySelector('input')).toBeNull();
    expect(select.querySelector('.currency-chip')?.textContent).toBe('Currency: PLN');
  });
});

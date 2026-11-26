// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { settingsRepository } from '@/entities/settings/api/settings-repository';
import { lockCurrency } from './lock-currency';

describe('lockCurrency', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('locks the chosen currency', async () => {
    await settingsRepository.save({ currency: 'PLN', currencyLocked: false });

    await lockCurrency();

    await expect(settingsRepository.get()).resolves.toEqual({
      currency: 'PLN',
      currencyLocked: true,
    });
  });

  it('saves nothing when the currency is already locked', async () => {
    await settingsRepository.save({ currency: 'PLN', currencyLocked: true });
    const save = vi.spyOn(settingsRepository, 'save');

    await lockCurrency();

    expect(save).not.toHaveBeenCalled();
  });
});

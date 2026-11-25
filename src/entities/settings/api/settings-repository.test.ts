// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from 'vitest';
import { settingsRepository } from './settings-repository';

describe('settingsRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the default settings when nothing is saved', async () => {
    await expect(settingsRepository.get()).resolves.toEqual({
      currency: 'EUR',
      currencyLocked: false,
    });
  });

  it('returns the saved settings', async () => {
    await settingsRepository.save({ currency: 'PLN', currencyLocked: true });

    await expect(settingsRepository.get()).resolves.toEqual({
      currency: 'PLN',
      currencyLocked: true,
    });
  });
});

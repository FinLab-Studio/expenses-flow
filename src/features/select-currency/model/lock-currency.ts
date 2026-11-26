import { settingsRepository } from '@/entities/settings/api/settings-repository';

// The currency can be changed only until the user first leaves About:
// app/main.ts calls this from router.onLeave('about', …). No router here, so it is easy to test.
// Already locked → nothing to save (every later visit to About ends here).
export async function lockCurrency(): Promise<void> {
  const settings = await settingsRepository.get();

  if (!settings.currencyLocked) {
    await settingsRepository.save({ ...settings, currencyLocked: true });
  }
}

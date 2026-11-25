import { readJson, writeJson } from '@/shared/api';
import { DEFAULT_SETTINGS } from '../model/default-settings';
import type { Settings } from '../model/settings.interface';
import type { SettingsRepository } from './settings-repository.interface';

const STORAGE_KEY = 'finlab.settings';

// After the MVP: pick the Firebase implementation here when VITE_STORAGE === 'firebase'
export const settingsRepository: SettingsRepository = {
  // Nothing saved or corrupted JSON (readJson warns and returns null) → the defaults.
  // A copy, so a caller can't change DEFAULT_SETTINGS by accident.
  async get() {
    return readJson<Settings>(STORAGE_KEY) ?? { ...DEFAULT_SETTINGS };
  },

  async save(settings) {
    writeJson(STORAGE_KEY, settings);
  },
};

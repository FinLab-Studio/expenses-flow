import type { Settings } from '../model/settings.interface';

// One value, not a list: get / save. Async like the other repositories (Firebase later).
export interface SettingsRepository {
  get(): Promise<Settings>;
  save(settings: Settings): Promise<void>;
}

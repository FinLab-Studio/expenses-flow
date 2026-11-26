import type { Settings } from './settings.interface';

// First launch: EUR, and the user can still change it on the About page.
export const DEFAULT_SETTINGS: Settings = { currency: 'EUR', currencyLocked: false };

import { Settings } from '@/types/settings';

const STORAGE_KEY = 'settings';

export const saveSettings = (settings: Settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'violet' | 'aqua';

interface PreferencesStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(persist((set) => ({
  theme: 'violet',
  setTheme: (theme) => set({ theme })
}), {
  name: 'nuclear-preferences'
}));

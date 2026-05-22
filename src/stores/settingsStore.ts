import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FeatureFlags {
  watchParty: boolean;
  friendCompat: boolean;
  quests: boolean;
}

interface SettingsState {
  flags: FeatureFlags;
  toggle: (key: keyof FeatureFlags) => void;
  set: (key: keyof FeatureFlags, value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      flags: { watchParty: false, friendCompat: false, quests: false },
      toggle: (key) => set((s) => ({ flags: { ...s.flags, [key]: !s.flags[key] } })),
      set: (key, value) => set((s) => ({ flags: { ...s.flags, [key]: value } })),
    }),
    { name: 'cineai-settings' },
  ),
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeId = 'aurora' | 'ember' | 'synthwave' | 'verdant' | 'solstice';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  desc: string;
  swatch: [string, string, string];
}

export const THEMES: ThemeMeta[] = [
  { id: 'aurora', name: 'Aurora', desc: 'Cyan, blue, violet', swatch: ['#22d3ee', '#3b82f6', '#8b5cf6'] },
  { id: 'ember', name: 'Ember', desc: 'Crimson, rose, violet', swatch: ['#e8624a', '#b5527e', '#7b5ea7'] },
  { id: 'synthwave', name: 'Synthwave', desc: 'Magenta, purple, cyan', swatch: ['#ff2e97', '#b026ff', '#05d9e8'] },
  { id: 'verdant', name: 'Verdant', desc: 'Lime, emerald, teal', swatch: ['#a3e635', '#34d399', '#2dd4bf'] },
  { id: 'solstice', name: 'Solstice', desc: 'Gold, amber, rose', swatch: ['#fcd34d', '#fb923c', '#fb7185'] },
];

interface ThemeState {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'aurora',
      setTheme: (t) => set({ theme: t }),
    }),
    { name: 'cineai-theme' },
  ),
);

// Apply the theme attribute to <html> so the CSS variable sets activate.
export function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute('data-theme', theme);
}

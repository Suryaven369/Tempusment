import { ThemeMode, THEME_MODES } from './constants';

export function isValidTheme(theme: string): theme is ThemeMode {
  return Object.values(THEME_MODES).includes(theme as ThemeMode);
}

export function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return THEME_MODES.LIGHT;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEME_MODES.DARK
    : THEME_MODES.LIGHT;
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.classList.remove(THEME_MODES.LIGHT, THEME_MODES.DARK);
  
  if (theme === THEME_MODES.SYSTEM) {
    root.classList.add(getSystemTheme());
  } else {
    root.classList.add(theme);
  }
}
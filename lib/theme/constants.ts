export const THEME_MODES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  } as const;
  
  export type ThemeMode = typeof THEME_MODES[keyof typeof THEME_MODES];
  
  export const DEFAULT_THEME: ThemeMode = THEME_MODES.SYSTEM;
  export const LANDING_PAGE_THEME: ThemeMode = THEME_MODES.DARK;
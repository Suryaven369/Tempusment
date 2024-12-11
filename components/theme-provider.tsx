"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import { updateAppearanceSettings } from "@/lib/firebase-settings";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { user } = useAuth();
  const { settings } = useSettings();

  // Set initial theme from user settings
  useEffect(() => {
    if (settings?.appearance?.theme) {
      const themeElement = document.documentElement;
      themeElement.setAttribute('data-theme', settings.appearance.theme);
    }
  }, [settings]);

  // Handle theme changes
  const handleThemeChange = async (theme: string) => {
    if (user && theme) {
      try {
        await updateAppearanceSettings({ theme: theme as 'light' | 'dark' | 'system' });
      } catch (error) {
        console.error('Error updating theme preference:', error);
      }
    }
  };

  return (
    <NextThemesProvider 
      {...props} 
      defaultTheme={settings?.appearance?.theme || 'system'}
      onValueChange={handleThemeChange}
    >
      {children}
    </NextThemesProvider>
  );
}
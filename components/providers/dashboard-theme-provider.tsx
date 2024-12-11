"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import { updateAppearanceSettings } from "@/lib/firebase-settings";
import { DEFAULT_THEME, ThemeMode } from "@/lib/theme/constants";
import { isValidTheme, applyTheme } from "@/lib/theme/utils";

interface DashboardThemeProviderProps {
  children: React.ReactNode;
}

export function DashboardThemeProvider({ children }: DashboardThemeProviderProps) {
  const { user } = useAuth();
  const { settings } = useSettings();

  useEffect(() => {
    if (!user) return;

    const savedTheme = settings?.appearance?.theme;
    if (savedTheme && isValidTheme(savedTheme)) {
      applyTheme(savedTheme);
    }
  }, [settings, user]);

  const handleThemeChange = async (theme: string) => {
    if (!user || !isValidTheme(theme)) return;

    try {
      await updateAppearanceSettings({ theme });
      applyTheme(theme as ThemeMode);
    } catch (error) {
      console.error("Error updating theme preference:", error);
    }
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={user ? settings?.appearance?.theme || DEFAULT_THEME : DEFAULT_THEME}
      enableSystem
      onValueChange={handleThemeChange}
    >
      {children}
    </ThemeProvider>
  );
}
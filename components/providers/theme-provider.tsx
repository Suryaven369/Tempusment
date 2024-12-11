"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";

export function ThemeProvider({ children }: Omit<ThemeProviderProps, 'attribute'>) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { settings } = useSettings();
  
  // Determine if we're on a landing page
  const isLandingPage = !pathname.startsWith('/dashboard') && !pathname.startsWith('/settings');
  
  // Use dark theme for landing pages, user preference for dashboard
  const theme = isLandingPage 
    ? 'dark'
    : (user ? settings?.appearance?.theme || 'system' : 'system');

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={!isLandingPage}
      disableTransitionOnChange
      forcedTheme={isLandingPage ? 'dark' : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}
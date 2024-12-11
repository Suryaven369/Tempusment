"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { LANDING_PAGE_THEME } from "@/lib/theme/constants";

interface LandingThemeProviderProps {
  children: React.ReactNode;
}

export function LandingThemeProvider({ children }: LandingThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={LANDING_PAGE_THEME}
      enableSystem={false}
      disableTransitionOnChange
      forcedTheme={LANDING_PAGE_THEME}
    >
      {children}
    </ThemeProvider>
  );
}
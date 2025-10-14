'use client'

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { loadThemeNames } from "@/lib/client-theme-names-loader";

interface CustomThemeProviderProps {
  children?: React.ReactNode;
  defaultTheme?: string;
  attribute?: string;
  enableSystem?: boolean;
}

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  const [themeNames, setThemeNames] = React.useState<string[]>([]);

  React.useEffect(() => {
    loadThemeNames().then(names => {
      setThemeNames(names);
    });
  }, []);

  return <NextThemesProvider attribute="data-theme" enableSystem themes={themeNames} {...props}>{children}</NextThemesProvider>
}
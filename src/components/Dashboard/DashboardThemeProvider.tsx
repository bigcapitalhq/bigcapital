// @ts-nocheck
import React from 'react';
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import rtlcss from 'stylis-rtlcss';
import { useAppIntlContext } from '../AppIntlProvider';

interface DashboardThemeProviderProps {
  children: React.ReactNode;
}

export function DashboardThemeProvider({
  children,
}: DashboardThemeProviderProps) {
  const { direction } = useAppIntlContext();

  return (
    <StyleSheetManager
      {...(direction === 'rtl' ? { stylisPlugins: [rtlcss] } : {})}
    >
      <ThemeProvider theme={{ dir: direction }}>{children}</ThemeProvider>
    </StyleSheetManager>
  );
}

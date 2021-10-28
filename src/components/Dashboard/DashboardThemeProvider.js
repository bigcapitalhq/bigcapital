import React from 'react';
import { ThemeProvider } from 'styled-components';
import { useAppIntlContext } from '../AppIntlProvider';

export function DashboardThemeProvider({ children }) {
  const { direction } = useAppIntlContext();

  return <ThemeProvider theme={{ dir: direction }}>{children}</ThemeProvider>;
}

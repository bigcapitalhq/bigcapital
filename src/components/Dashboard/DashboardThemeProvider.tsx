import React from 'react';
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import rtlcss from 'stylis-rtlcss';
import { useAppIntlContext } from '../AppIntlProvider';

export function DashboardThemeProvider({ children }) {
  const { direction } = useAppIntlContext();

  return (
    <StyleSheetManager
      {...(direction === 'rtl' ? { stylisPlugins: [rtlcss] } : {})}
    >
      <ThemeProvider theme={{ dir: direction }}>{children}</ThemeProvider>
    </StyleSheetManager>
  );
}

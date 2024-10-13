import React from 'react';
import {
  ThemeProvider as StyleComponentsThemeProvider,
  StyleSheetManager,
} from 'styled-components';
import rtlcss from 'stylis-rtlcss';
import {
  defaultTheme,
  ThemeProvider as XStyledEmotionThemeProvider,
} from '@xstyled/emotion';
import { useAppIntlContext } from '../AppIntlProvider';

const theme = {
  ...defaultTheme,
  bpPrefix: 'bp4',
};

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
      <StyleComponentsThemeProvider theme={{ dir: direction }}>
        <XStyledEmotionThemeProvider theme={theme}>
          {children}
        </XStyledEmotionThemeProvider>
      </StyleComponentsThemeProvider>
    </StyleSheetManager>
  );
}

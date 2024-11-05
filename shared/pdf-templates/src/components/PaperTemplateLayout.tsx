import { CacheProvider, ThemeProvider } from '@emotion/react';
import { EmotionCache } from '@emotion/cache';
import { defaultTheme } from '@xstyled/system';
import { Preflight } from '@xstyled/emotion';

const theme = {
  ...defaultTheme,
};
export function PaperTemplateLayout({
  cache,
  children,
}: {
  children: React.ReactNode;
  cache: EmotionCache;
}) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <Preflight />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

import { CacheProvider, ThemeProvider } from '@emotion/react';
import { EmotionCache } from '@emotion/cache';
import { defaultTheme } from '@xstyled/system';

const theme = {
  ...defaultTheme,
};
export function PaperTemplateLayout({ cache, children }: {
  children: React.ReactNode;
  cache: EmotionCache;
}) {
  const html = (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );

  return (
    <html lang="en">
      <body>
        <div id="root">{html}</div>
      </body>
    </html>
  );
}

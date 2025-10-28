import { CacheProvider, ThemeProvider } from '@emotion/react';
import { EmotionCache } from '@emotion/cache';
import { defaultTheme } from '@xstyled/system';
import { createGlobalStyle, Preflight } from '@xstyled/emotion';

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
        <GlobalStyles />

        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

// Create global styles to set the body font
const GlobalStyles = createGlobalStyle`
*,
*::before,
*::after {
  box-sizing: border-box;
}
th {
  text-align: inherit;
  text-align: -webkit-match-parent;
}
thead,
tbody,
tfoot,
tr,
td,
th {
  border-color: inherit;
  border-style: solid;
  border-width: 0;
}
body{
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #000;
  background-color: #fff;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}
body, h1, h2, h3, h4, h5, h6{
  font-family: "Open Sans", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
strong {
  font-weight: 600;
}
`;

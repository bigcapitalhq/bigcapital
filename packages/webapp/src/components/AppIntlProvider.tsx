// @ts-nocheck
import React, { createContext } from 'react';

interface AppIntlContextValue {
  currentLocale: string;
  direction: 'rtl' | 'ltr';
  isRTL: boolean;
  isLTR: boolean;
}

const AppIntlContext = createContext<AppIntlContextValue>(
  {} as AppIntlContextValue,
);

interface AppIntlProviderProps {
  currentLocale: string;
  isRTL: boolean;
  children: React.ReactNode;
}

/**
 * Application intl provider.
 */
function AppIntlProvider({
  currentLocale,
  isRTL,
  children,
}: AppIntlProviderProps) {
  const provider = {
    currentLocale,
    isRTL,
    isLTR: !isRTL,
    direction: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <AppIntlContext.Provider value={provider}>
      {children}
    </AppIntlContext.Provider>
  );
}

const useAppIntlContext = () =>
  React.useContext<AppIntlContextValue>(AppIntlContext);

export { AppIntlProvider, useAppIntlContext };

import React, { createContext } from 'react';

const AppIntlContext = createContext();

/**
 * Application intl provider.
 */
function AppIntlProvider({ currentLocale, isRTL, children }) {
  const provider = {
    currentLocale,
    isRTL,
    isLTR: !isRTL,
  };

  return (
    <AppIntlContext.Provider value={provider}>
      {children}
    </AppIntlContext.Provider>
  );
}

const useAppIntlContext = () => React.useContext(AppIntlContext);

export { AppIntlProvider, useAppIntlContext };

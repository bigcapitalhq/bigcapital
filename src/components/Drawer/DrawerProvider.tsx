// @ts-nocheck
import React, { createContext, useContext } from 'react';

const DrawerContext = createContext();

/**
 * Account form provider.
 */
function DrawerProvider({ ...props }) {
  const provider = { ...props };

  return <DrawerContext.Provider value={provider} {...props} />;
}

const useDrawerContext = () => useContext(DrawerContext);

export { DrawerProvider, useDrawerContext };

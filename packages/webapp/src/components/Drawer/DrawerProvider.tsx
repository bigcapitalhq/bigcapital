// @ts-nocheck
import React, { createContext, useContext } from 'react';

interface DrawerContextValue {
  name: string;
  payload: Record<string, any>;
}

const DrawerContext = createContext<DrawerContextValue>(
  {} as DrawerContextValue,
);

/**
 * Account form provider.
 */
function DrawerProvider({ ...props }) {
  const provider = { ...props };

  return <DrawerContext.Provider value={provider} {...props} />;
}

const useDrawerContext = () => useContext(DrawerContext);

export { DrawerProvider, useDrawerContext };

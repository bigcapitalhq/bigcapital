import React, { createContext, useContext } from 'react';

export interface DrawerContextValue<TPayload = Record<string, any>> {
  name: string;
  payload: TPayload;
}

const DrawerContext = createContext<DrawerContextValue<any> | undefined>(
  undefined,
);

export interface DrawerProviderProps<TPayload = Record<string, any>> {
  name: string;
  payload?: TPayload;
  children?: React.ReactNode;
}

/**
 * Drawer provider.
 */
function DrawerProvider<TPayload = Record<string, any>>({
  name,
  payload,
  children,
}: DrawerProviderProps<TPayload>) {
  const provider: DrawerContextValue<TPayload> = {
    name,
    payload: payload as TPayload,
  };

  return (
    <DrawerContext.Provider value={provider}>{children}</DrawerContext.Provider>
  );
}

const useDrawerContext = <
  TPayload = Record<string, any>,
>(): DrawerContextValue<TPayload> => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawerContext must be used within a DrawerProvider');
  }
  return context as DrawerContextValue<TPayload>;
};

export { DrawerProvider, useDrawerContext };

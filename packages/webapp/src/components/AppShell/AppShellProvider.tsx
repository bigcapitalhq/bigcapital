import React, { createContext } from 'react';

interface AppShellContextValue {
  topbarOffset: number
}

const AppShellContext = createContext<AppShellContextValue>(
  {} as AppShellContextValue,
);

interface AppShellProviderProps {
  children: React.ReactNode;
  mainProps: any;
  asideProps: any;
  topbarOffset: number;
}

export function AppShellProvider({ topbarOffset, ...props }: AppShellProviderProps) {
  const provider = { topbarOffset } as AppShellContextValue;

  return <AppShellContext.Provider value={provider} {...props} />;
}

export const useAppShellContext = () =>
  React.useContext<AppShellContextValue>(AppShellContext);

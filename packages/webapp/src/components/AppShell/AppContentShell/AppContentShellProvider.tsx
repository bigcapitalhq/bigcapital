// @ts-nocheck
import React, { createContext } from 'react';

interface ContentShellCommonValue {
  mainProps: any;
  asideProps: any;
  topbarOffset: number;
  hideAside: boolean;
  hideMain: boolean;
}

interface AppShellContextValue extends ContentShellCommonValue {
  topbarOffset: number;
}

const AppShellContext = createContext<AppShellContextValue>(
  {} as AppShellContextValue,
);

interface AppShellProviderProps extends ContentShellCommonValue {
  children: React.ReactNode;
}

export function AppShellProvider({
  topbarOffset,
  hideAside,
  hideMain,
  ...props
}: AppShellProviderProps) {
  const provider = {
    topbarOffset,
    hideAside,
    hideMain,
  } as AppShellContextValue;

  return <AppShellContext.Provider value={provider} {...props} />;
}

export const useAppShellContext = () =>
  React.useContext<AppShellContextValue>(AppShellContext);

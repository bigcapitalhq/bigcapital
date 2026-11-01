import React from 'react';
import { FinancialReportPage } from '../FinancialReportPage';

type UnrealizedGainOrLossContextValue = Record<string, unknown>;

type UnrealizedGainOrLossProviderProps = {
  filter?: Record<string, unknown>;
  children?: React.ReactNode;
};

const UnrealizedGainOrLossContext = React.createContext<
  UnrealizedGainOrLossContextValue | undefined
>(undefined);

function UnrealizedGainOrLossProvider({
  filter,
  ...props
}: UnrealizedGainOrLossProviderProps) {
  const provider: UnrealizedGainOrLossContextValue = {};
  return (
    <FinancialReportPage name="unrealized-gain-loss">
      <UnrealizedGainOrLossContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useUnrealizedGainOrLossContext = (): UnrealizedGainOrLossContextValue => {
  const ctx = React.useContext(UnrealizedGainOrLossContext);
  if (!ctx)
    throw new Error(
      'useUnrealizedGainOrLossContext must be used within UnrealizedGainOrLossProvider',
    );
  return ctx;
};

export { UnrealizedGainOrLossProvider, useUnrealizedGainOrLossContext };

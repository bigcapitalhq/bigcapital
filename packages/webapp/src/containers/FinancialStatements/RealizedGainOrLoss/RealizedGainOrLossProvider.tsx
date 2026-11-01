import React from 'react';
import { FinancialReportPage } from '../FinancialReportPage';

type RealizedGainOrLossContextValue = Record<string, unknown>;

type RealizedGainOrLossProviderProps = {
  filter?: Record<string, unknown>;
  children?: React.ReactNode;
};

const RealizedGainOrLossContext = React.createContext<
  RealizedGainOrLossContextValue | undefined
>(undefined);

function RealizedGainOrLossProvider({
  filter,
  ...props
}: RealizedGainOrLossProviderProps) {
  const provider: RealizedGainOrLossContextValue = {};

  return (
    <FinancialReportPage name="realized-gain-loss">
      <RealizedGainOrLossContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useRealizedGainOrLossContext = (): RealizedGainOrLossContextValue => {
  const ctx = React.useContext(RealizedGainOrLossContext);
  if (!ctx)
    throw new Error(
      'useRealizedGainOrLossContext must be used within RealizedGainOrLossProvider',
    );
  return ctx;
};

export { RealizedGainOrLossProvider, useRealizedGainOrLossContext };

// @ts-nocheck
import React from 'react';

import FinancialReportPage from '../FinancialReportPage';

const UnrealizedGainOrLossContext = React.createContext();

/**
 * Unrealized Gain or Loss provider.
 */
function UnrealizedGainOrLossProvider({ filter, ...props }) {
  const provider = {};
  return (
    <FinancialReportPage name="unrealized-gain-loss">
      <UnrealizedGainOrLossContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useUnrealizedGainOrLossContext = () =>
  React.useContext(UnrealizedGainOrLossContext);

export { UnrealizedGainOrLossProvider, useUnrealizedGainOrLossContext };

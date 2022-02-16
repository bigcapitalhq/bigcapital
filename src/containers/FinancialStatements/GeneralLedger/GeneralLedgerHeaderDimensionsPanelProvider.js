import React from 'react';

import { useBranches } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const GeneralLedgerHeaderDimensionsPanelContext = React.createContext();

/**
 * General Ledger Header Dimensions Panel provider.
 * @returns
 */
function GeneralLedgerHeaderDimensionsPanelProvider({ ...props }) {
  // Fetches the branches list.
  const { isLoading: isBranchesLoading, data: branches } = useBranches();

  // Provider
  const provider = {
    branches,
    isBranchesLoading,
  };

  return isBranchesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <GeneralLedgerHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useGeneralLedgerHeaderDimensionsContext = () =>
  React.useContext(GeneralLedgerHeaderDimensionsPanelContext);

export {
  GeneralLedgerHeaderDimensionsPanelProvider,
  useGeneralLedgerHeaderDimensionsContext,
};

import React from 'react';

import { useBranches } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const BalanceSheetHeaderDimensionsPanelContext = React.createContext();

/**
 * BL sheet header provider.
 * @returns
 */
function BalanceSheetHeaderDimensionsProvider({ ...props }) {
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
    <BalanceSheetHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useBalanceSheetHeaderDimensionsPanelContext = () =>
  React.useContext(BalanceSheetHeaderDimensionsPanelContext);

export {
  BalanceSheetHeaderDimensionsProvider,
  useBalanceSheetHeaderDimensionsPanelContext,
};

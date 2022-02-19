import React from 'react';

import { useBranches } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const ProfitLossSheetHeaderDimensionsPanelContext = React.createContext();

/**
 * profit loss sheet header provider.
 * @returns
 */
function ProfitLossSheetHeaderDimensionsProvider({ ...props }) {
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
    <ProfitLossSheetHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useProfitLossSheetPanelContext = () =>
  React.useContext(ProfitLossSheetHeaderDimensionsPanelContext);

export {
  ProfitLossSheetHeaderDimensionsProvider,
  useProfitLossSheetPanelContext,
};

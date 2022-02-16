import React from 'react';

import { useBranches } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const ProfitLossSheetHeaderDimensionsPanelConext = React.createContext();

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
    <ProfitLossSheetHeaderDimensionsPanelConext.Provider
      value={provider}
      {...props}
    />
  );
}

const useProfitLossSheetPanelContext = () =>
  React.useContext(ProfitLossSheetHeaderDimensionsPanelConext);

export {
  ProfitLossSheetHeaderDimensionsProvider,
  useProfitLossSheetPanelContext,
};

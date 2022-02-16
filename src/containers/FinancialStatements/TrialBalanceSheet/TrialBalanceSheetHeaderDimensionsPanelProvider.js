import React from 'react';
import { useBranches } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const TrialBLSheetHeaderDimensionsContext = React.createContext();

/**
 *  Trial BL sheet header provider.
 * @returns
 */
function TrialBLHeaderDimensionsPanelProvider({ ...props }) {
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
    <TrialBLSheetHeaderDimensionsContext.Provider value={provider} {...props} />
  );
}

const useTrialBalanceSheetPanelContext = () =>
  React.useContext(TrialBLSheetHeaderDimensionsContext);

export { TrialBLHeaderDimensionsPanelProvider, useTrialBalanceSheetPanelContext };

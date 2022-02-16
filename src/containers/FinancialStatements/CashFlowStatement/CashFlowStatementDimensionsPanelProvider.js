import React from 'react';

import { useBranches } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const CashFlowStatementDimensionsPanelContext = React.createContext();

/**
 * cash flow statement dimensions panel provider.
 * @returns
 */
function CashFlowStatementDimensionsPanelProvider({ ...props }) {
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
    <CashFlowStatementDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useCashFlowStatementDimensionsPanelContext = () =>
  React.useContext(CashFlowStatementDimensionsPanelContext);

export {
  CashFlowStatementDimensionsPanelProvider,
  useCashFlowStatementDimensionsPanelContext,
};

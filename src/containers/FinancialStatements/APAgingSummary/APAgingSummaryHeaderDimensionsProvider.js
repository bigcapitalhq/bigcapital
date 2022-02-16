import React from 'react';

import { useBranches } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const APAgingSummaryHeaderDimensonsContext = React.createContext();

/**
 * APAging summary header dismensions provider.
 * @returns
 */
function APAgingSummaryHeaderDimensionsProvider({ ...props }) {
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
    <APAgingSummaryHeaderDimensonsContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useAPAgingSummaryHeaderDimensonsContext = () =>
  React.useContext(APAgingSummaryHeaderDimensonsContext);

export {
  APAgingSummaryHeaderDimensionsProvider,
  useAPAgingSummaryHeaderDimensonsContext,
};

import React from 'react';

import { useBranches } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const ARAgingSummaryHeaderDimensonsContext = React.createContext();

/**
 * ARAging summary header dismensions provider.
 * @returns
 */
function ARAgingSummaryHeaderDimensionsProvider({ ...props }) {
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
    <ARAgingSummaryHeaderDimensonsContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useARAgingSummaryHeaderDimensonsContext = () =>
  React.useContext(ARAgingSummaryHeaderDimensonsContext);

export {
  ARAgingSummaryHeaderDimensionsProvider,
  useARAgingSummaryHeaderDimensonsContext,
};

import React from 'react';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { useBranches } from '@/hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const APAgingSummaryHeaderDimensonsContext = React.createContext();

/**
 * APAging summary header dismensions provider.
 * @returns
 */
function APAgingSummaryHeaderDimensionsProvider({ query, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches the branches list.
  const { isLoading: isBranchesLoading, data: branches } = useBranches(query, {
    enabled: isBranchFeatureCan,
    keepPreviousData: true,
  });

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

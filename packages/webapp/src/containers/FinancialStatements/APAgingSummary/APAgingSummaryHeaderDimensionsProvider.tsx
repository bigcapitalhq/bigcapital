// @ts-nocheck
import React from 'react';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { useBranches } from '@/hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const APAgingSummaryHeaderDimensionsContext = React.createContext();

/**
 * APAging summary header dimensions provider.
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
    <APAgingSummaryHeaderDimensionsContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useAPAgingSummaryHeaderDimensionsContext = () =>
  React.useContext(APAgingSummaryHeaderDimensionsContext);

export {
  APAgingSummaryHeaderDimensionsProvider,
  useAPAgingSummaryHeaderDimensionsContext,
};

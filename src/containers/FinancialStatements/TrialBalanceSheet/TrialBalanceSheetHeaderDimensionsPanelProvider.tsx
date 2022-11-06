// @ts-nocheck
import React from 'react';
import { Features } from '@/constants';
import { useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const TrialBLSheetHeaderDimensionsContext = React.createContext();

/**
 *  Trial BL sheet header provider.
 * @returns
 */
function TrialBLHeaderDimensionsPanelProvider({ query, ...props }) {
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
    <TrialBLSheetHeaderDimensionsContext.Provider value={provider} {...props} />
  );
}

const useTrialBalanceSheetPanelContext = () =>
  React.useContext(TrialBLSheetHeaderDimensionsContext);

export {
  TrialBLHeaderDimensionsPanelProvider,
  useTrialBalanceSheetPanelContext,
};

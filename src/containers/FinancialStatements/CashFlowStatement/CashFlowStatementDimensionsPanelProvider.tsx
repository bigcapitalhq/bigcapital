// @ts-nocheck
import React from 'react';
import { Features } from '@/constants';
import { useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const CashFlowStatementDimensionsPanelContext = React.createContext();

/**
 * cash flow statement dimensions panel provider.
 * @returns
 */
function CashFlowStatementDimensionsPanelProvider({ query, ...props }) {
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

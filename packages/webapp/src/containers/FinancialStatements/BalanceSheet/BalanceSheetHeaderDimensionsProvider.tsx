import React from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import type { BranchesListResponse } from '@bigcapital/sdk-ts';
import { Features } from '@/constants';
import { useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

interface BalanceSheetHeaderDimensionsContextValue {
  branches: BranchesListResponse | undefined;
  isBranchesLoading: boolean;
}

interface BalanceSheetHeaderDimensionsProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

const BalanceSheetHeaderDimensionsPanelContext = React.createContext<
  BalanceSheetHeaderDimensionsContextValue | undefined
>(undefined);

function BalanceSheetHeaderDimensionsProvider({
  query,
  ...props
}: BalanceSheetHeaderDimensionsProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches the branches list.
  const { isLoading: isBranchesLoading, data: branches } = useBranches(query, {
    enabled: isBranchFeatureCan,
    // keepPreviousData: true,
  });

  // Provider
  const provider: BalanceSheetHeaderDimensionsContextValue = {
    branches,
    isBranchesLoading,
  };

  return isBranchesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <BalanceSheetHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useBalanceSheetHeaderDimensionsPanelContext =
  (): BalanceSheetHeaderDimensionsContextValue => {
    const ctx = React.useContext(BalanceSheetHeaderDimensionsPanelContext);
    if (!ctx) {
      throw new Error(
        'useBalanceSheetHeaderDimensionsPanelContext must be used within BalanceSheetHeaderDimensionsProvider',
      );
    }
    return ctx;
  };

export {
  BalanceSheetHeaderDimensionsProvider,
  useBalanceSheetHeaderDimensionsPanelContext,
};

import React, { ReactNode } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';
import { useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type TrialBLSheetHeaderDimensionsContextValue = {
  branches: ReturnType<typeof useBranches>['data'];
  isBranchesLoading: boolean;
};

interface TrialBLHeaderDimensionsPanelProviderProps {
  query?: Record<string, unknown>;
  children?: ReactNode;
}

const TrialBLSheetHeaderDimensionsContext = React.createContext<
  TrialBLSheetHeaderDimensionsContextValue | undefined
>(undefined);

/**
 *  Trial BL sheet header provider.
 * @returns
 */
function TrialBLHeaderDimensionsPanelProvider({
  query,
  ...props
}: TrialBLHeaderDimensionsPanelProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches the branches list.
  const { isLoading: isBranchesLoading, data: branches } = useBranches(query, {
    enabled: isBranchFeatureCan,
    placeholderData: (prev) => prev,
  });

  // Provider
  const provider: TrialBLSheetHeaderDimensionsContextValue = {
    branches,
    isBranchesLoading,
  };

  return isBranchesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <TrialBLSheetHeaderDimensionsContext.Provider value={provider} {...props} />
  );
}

const useTrialBalanceSheetPanelContext =
  (): TrialBLSheetHeaderDimensionsContextValue => {
    const ctx = React.useContext(TrialBLSheetHeaderDimensionsContext);
    if (!ctx)
      throw new Error(
        'useTrialBalanceSheetPanelContext must be used within a TrialBLHeaderDimensionsPanelProvider',
      );
    return ctx;
  };

export {
  TrialBLHeaderDimensionsPanelProvider,
  useTrialBalanceSheetPanelContext,
};

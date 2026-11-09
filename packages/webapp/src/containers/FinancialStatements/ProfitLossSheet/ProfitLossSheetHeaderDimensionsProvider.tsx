import React from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';
import { useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type UseBranchesResult = ReturnType<typeof useBranches>;

type ProfitLossSheetHeaderDimensionsPanelContextValue = {
  branches: UseBranchesResult['data'];
  isBranchesLoading: boolean;
};

type ProfitLossSheetHeaderDimensionsProviderProps = {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
};

const ProfitLossSheetHeaderDimensionsPanelContext = React.createContext<
  ProfitLossSheetHeaderDimensionsPanelContextValue | undefined
>(undefined);

function ProfitLossSheetHeaderDimensionsProvider({
  query,
  ...props
}: ProfitLossSheetHeaderDimensionsProviderProps) {
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  const { isLoading: isBranchesLoading, data: branches } = useBranches(query, {
    enabled: isBranchFeatureCan,
    placeholderData: (prev) => prev,
  });

  const provider: ProfitLossSheetHeaderDimensionsPanelContextValue = {
    branches,
    isBranchesLoading,
  };

  return isBranchesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <ProfitLossSheetHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useProfitLossSheetPanelContext =
  (): ProfitLossSheetHeaderDimensionsPanelContextValue => {
    const ctx = React.useContext(ProfitLossSheetHeaderDimensionsPanelContext);
    if (!ctx) {
      throw new Error(
        'useProfitLossSheetPanelContext must be used within ProfitLossSheetHeaderDimensionsProvider',
      );
    }
    return ctx;
  };

export {
  ProfitLossSheetHeaderDimensionsProvider,
  useProfitLossSheetPanelContext,
};

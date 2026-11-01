import React from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';
import { useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type UseBranchesResult = ReturnType<typeof useBranches>;

type APAgingSummaryHeaderDimensionsContextValue = {
  branches: UseBranchesResult['data'];
  isBranchesLoading: boolean;
};

type APAgingSummaryHeaderDimensionsProviderProps = {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
};

const APAgingSummaryHeaderDimensonsContext = React.createContext<
  APAgingSummaryHeaderDimensionsContextValue | undefined
>(undefined);

function APAgingSummaryHeaderDimensionsProvider({
  query,
  children,
  ...props
}: APAgingSummaryHeaderDimensionsProviderProps) {
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  const { isLoading: isBranchesLoading, data: branches } = useBranches(query, {
    enabled: isBranchFeatureCan,
    placeholderData: (prev) => prev,
  });

  const provider: APAgingSummaryHeaderDimensionsContextValue = {
    branches,
    isBranchesLoading,
  };

  return isBranchesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <APAgingSummaryHeaderDimensonsContext.Provider value={provider} {...props}>
      {children}
    </APAgingSummaryHeaderDimensonsContext.Provider>
  );
}

const useAPAgingSummaryHeaderDimensonsContext =
  (): APAgingSummaryHeaderDimensionsContextValue => {
    const ctx = React.useContext(APAgingSummaryHeaderDimensonsContext);
    if (!ctx)
      throw new Error(
        'useAPAgingSummaryHeaderDimensonsContext must be used within APAgingSummaryHeaderDimensionsProvider',
      );
    return ctx;
  };

export {
  APAgingSummaryHeaderDimensionsProvider,
  useAPAgingSummaryHeaderDimensonsContext,
};

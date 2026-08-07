import React from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';
import { useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type UseBranchesResult = ReturnType<typeof useBranches>;

type ARAgingSummaryHeaderDimensionsContextValue = {
  branches: UseBranchesResult['data'];
  isBranchesLoading: boolean;
};

type ARAgingSummaryHeaderDimensionsProviderProps = {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
};

const ARAgingSummaryHeaderDimensonsContext = React.createContext<
  ARAgingSummaryHeaderDimensionsContextValue | undefined
>(undefined);

function ARAgingSummaryHeaderDimensionsProvider({
  query,
  children,
  ...props
}: ARAgingSummaryHeaderDimensionsProviderProps) {
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  const { isLoading: isBranchesLoading, data: branches } = useBranches(query, {
    enabled: isBranchFeatureCan,
    placeholderData: (prev) => prev,
  });

  const provider: ARAgingSummaryHeaderDimensionsContextValue = {
    branches,
    isBranchesLoading,
  };

  return isBranchesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <ARAgingSummaryHeaderDimensonsContext.Provider value={provider} {...props}>
      {children}
    </ARAgingSummaryHeaderDimensonsContext.Provider>
  );
}

const useARAgingSummaryHeaderDimensonsContext =
  (): ARAgingSummaryHeaderDimensionsContextValue => {
    const ctx = React.useContext(ARAgingSummaryHeaderDimensonsContext);
    if (!ctx)
      throw new Error(
        'useARAgingSummaryHeaderDimensonsContext must be used within ARAgingSummaryHeaderDimensionsProvider',
      );
    return ctx;
  };

export {
  ARAgingSummaryHeaderDimensionsProvider,
  useARAgingSummaryHeaderDimensonsContext,
};

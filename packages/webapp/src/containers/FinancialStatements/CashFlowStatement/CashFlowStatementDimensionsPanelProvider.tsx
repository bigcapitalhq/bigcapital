import React from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';
import { useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type UseBranchesResult = ReturnType<typeof useBranches>;

type CashFlowStatementDimensionsPanelContextValue = {
  branches: UseBranchesResult['data'];
  isBranchesLoading: boolean;
};

type CashFlowStatementDimensionsPanelProviderProps = {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
};

const CashFlowStatementDimensionsPanelContext = React.createContext<
  CashFlowStatementDimensionsPanelContextValue | undefined
>(undefined);

function CashFlowStatementDimensionsPanelProvider({
  query,
  ...props
}: CashFlowStatementDimensionsPanelProviderProps) {
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  const { isLoading: isBranchesLoading, data: branches } = useBranches(query, {
    enabled: isBranchFeatureCan,
    placeholderData: (prev) => prev,
  });

  const provider: CashFlowStatementDimensionsPanelContextValue = {
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

const useCashFlowStatementDimensionsPanelContext =
  (): CashFlowStatementDimensionsPanelContextValue => {
    const ctx = React.useContext(CashFlowStatementDimensionsPanelContext);
    if (!ctx) {
      throw new Error(
        'useCashFlowStatementDimensionsPanelContext must be used within CashFlowStatementDimensionsPanelProvider',
      );
    }
    return ctx;
  };

export {
  CashFlowStatementDimensionsPanelProvider,
  useCashFlowStatementDimensionsPanelContext,
};

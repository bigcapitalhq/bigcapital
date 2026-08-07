import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { Features } from '@/constants';
import { useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type GeneralLedgerHeaderDimensionsPanelContextValue = {
  branches: ReturnType<typeof useBranches>['data'];
  isBranchesLoading: boolean;
};

type GeneralLedgerHeaderDimensionsPanelProviderProps = {
  children?: React.ReactNode;
};

const GeneralLedgerHeaderDimensionsPanelContext = createContext<
  GeneralLedgerHeaderDimensionsPanelContextValue | undefined
>(undefined);

/**
 * General Ledger Header Dimensions Panel provider.
 * @returns {JSX.Element}
 */
function GeneralLedgerHeaderDimensionsPanelProvider({
  ...props
}: GeneralLedgerHeaderDimensionsPanelProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches the branches list.
  const { isLoading: isBranchesLoading, data: branches } = useBranches(
    undefined,
    {
      enabled: isBranchFeatureCan,
      placeholderData: (previousData) => previousData,
    },
  );

  // Provider
  const provider: GeneralLedgerHeaderDimensionsPanelContextValue = {
    branches,
    isBranchesLoading,
  };

  return isBranchesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <GeneralLedgerHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useGeneralLedgerHeaderDimensionsContext =
  (): GeneralLedgerHeaderDimensionsPanelContextValue => {
    const ctx = useContext(GeneralLedgerHeaderDimensionsPanelContext);
    if (!ctx) {
      throw new Error(
        'useGeneralLedgerHeaderDimensionsContext must be used within a GeneralLedgerHeaderDimensionsPanelProvider',
      );
    }
    return ctx;
  };

export {
  GeneralLedgerHeaderDimensionsPanelProvider,
  useGeneralLedgerHeaderDimensionsContext,
};

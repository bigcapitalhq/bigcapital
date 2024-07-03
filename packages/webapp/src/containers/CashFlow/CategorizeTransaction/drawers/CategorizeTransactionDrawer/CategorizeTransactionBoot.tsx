// @ts-nocheck
import React, { useMemo } from 'react';
import { first } from 'lodash';
import { DrawerLoading } from '@/components';
import { useAccounts, useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';
import { Spinner } from '@blueprintjs/core';
import { useGetRecognizedBankTransaction } from '@/hooks/query/bank-rules';
import { useCategorizeTransactionTabsBoot } from '@/containers/CashFlow/CategorizeTransactionAside/CategorizeTransactionTabsBoot';

interface CategorizeTransactionBootProps {
  children: React.ReactNode;
}

interface CategorizeTransactionBootValue {
  branches: any;
  accounts: any;
  isBranchesLoading: boolean;
  isAccountsLoading: boolean;
  primaryBranch: any;
  recognizedTranasction: any;
  isRecognizedTransactionLoading: boolean;
}

const CategorizeTransactionBootContext =
  React.createContext<CategorizeTransactionBootValue>(
    {} as CategorizeTransactionBootValue,
  );

/**
 * Categorize transcation boot.
 */
function CategorizeTransactionBoot({
  ...props
}: CategorizeTransactionBootProps) {
  const { uncategorizedTransaction, uncategorizedTransactionId } =
    useCategorizeTransactionTabsBoot();

  // Detarmines whether the feature is enabled.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  // Fetches the branches list.
  const { data: branches, isLoading: isBranchesLoading } = useBranches(
    {},
    { enabled: isBranchFeatureCan },
  );
  // Fetches the recognized transaction.
  const {
    data: recognizedTranasction,
    isLoading: isRecognizedTransactionLoading,
  } = useGetRecognizedBankTransaction(uncategorizedTransactionId, {
    enabled: !!uncategorizedTransaction.is_recognized,
  });

  // Retrieves the primary branch.
  const primaryBranch = useMemo(
    () => branches?.find((b) => b.primary) || first(branches),
    [branches],
  );

  const provider = {
    branches,
    accounts,
    isBranchesLoading,
    isAccountsLoading,
    primaryBranch,
    recognizedTranasction,
    isRecognizedTransactionLoading,
  };
  const isLoading =
    isBranchesLoading || isAccountsLoading || isRecognizedTransactionLoading;

  if (isLoading) {
    <Spinner size={30} />;
  }
  return (
    <DrawerLoading loading={isLoading}>
      <CategorizeTransactionBootContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useCategorizeTransactionBoot = () =>
  React.useContext<CategorizeTransactionBootValue>(
    CategorizeTransactionBootContext,
  );

export { CategorizeTransactionBoot, useCategorizeTransactionBoot };

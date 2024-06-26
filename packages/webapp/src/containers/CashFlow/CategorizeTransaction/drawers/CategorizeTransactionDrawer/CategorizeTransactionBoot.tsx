// @ts-nocheck
import React, { useMemo } from 'react';
import { first } from 'lodash';
import { DrawerLoading } from '@/components';
import {
  useAccounts,
  useBranches,
  useUncategorizedTransaction,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';

const CategorizeTransactionBootContext = React.createContext();

/**
 * Categorize transcation boot.
 */
function CategorizeTransactionBoot({ uncategorizedTransactionId, ...props }) {
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
  // Retrieves the uncategorized transaction.
  const {
    data: uncategorizedTransaction,
    isLoading: isUncategorizedTransactionLoading,
  } = useUncategorizedTransaction(uncategorizedTransactionId);

  // Retrieves the primary branch.
  const primaryBranch = useMemo(
    () => branches?.find((b) => b.primary) || first(branches),
    [branches],
  );

  const provider = {
    uncategorizedTransactionId,
    uncategorizedTransaction,
    isUncategorizedTransactionLoading,
    branches,
    accounts,
    isBranchesLoading,
    isAccountsLoading,
    primaryBranch,
  };
  const isLoading =
    isBranchesLoading || isUncategorizedTransactionLoading || isAccountsLoading;

  return (
    <DrawerLoading loading={isLoading}>
      <CategorizeTransactionBootContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useCategorizeTransactionBoot = () =>
  React.useContext(CategorizeTransactionBootContext);

export { CategorizeTransactionBoot, useCategorizeTransactionBoot };

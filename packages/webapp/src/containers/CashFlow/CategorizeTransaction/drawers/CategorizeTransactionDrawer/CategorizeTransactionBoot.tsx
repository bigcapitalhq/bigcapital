// @ts-nocheck
import React, { useMemo } from 'react';
import { first } from 'lodash';
import { DrawerLoading } from '@/components';
import { useAccounts, useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';
import { Spinner } from '@blueprintjs/core';

interface CategorizeTransactionBootProps {
  children: React.ReactNode;
}

interface CategorizeTransactionBootValue {
  branches: any;
  accounts: any;
  isBranchesLoading: boolean;
  isAccountsLoading: boolean;
  primaryBranch: any;
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
  };
  const isLoading = isBranchesLoading || isAccountsLoading;

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

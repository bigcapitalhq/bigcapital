import { useAccounts, useBranches } from '@/hooks/query';
import { Spinner } from '@blueprintjs/core';
import React from 'react';

interface MatchingReconcileTransactionBootProps {
  children: React.ReactNode;
}
interface MatchingReconcileTransactionBootValue {}

const MatchingReconcileTransactionBootContext =
  React.createContext<MatchingReconcileTransactionBootValue>(
    {} as MatchingReconcileTransactionBootValue,
  );

export function MatchingReconcileTransactionBoot({
  children,
}: MatchingReconcileTransactionBootProps) {
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts({}, {});
  const { data: branches, isLoading: isBranchesLoading } = useBranches({}, {});

  const provider = {
    accounts,
    branches,
    isAccountsLoading,
    isBranchesLoading,
  };
  const isLoading = isAccountsLoading || isBranchesLoading;

  if (isLoading) {
    return <Spinner size={20} />;
  }

  return (
    <MatchingReconcileTransactionBootContext.Provider value={provider}>
      {children}
    </MatchingReconcileTransactionBootContext.Provider>
  );
}

export const useMatchingReconcileTransactionBoot = () =>
  React.useContext<MatchingReconcileTransactionBootValue>(
    MatchingReconcileTransactionBootContext,
  );

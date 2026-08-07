import React from 'react';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import type { BankingTransactionResponse } from '@bigcapital/sdk-ts';
import { IntersectionObserver } from '@/components';
import { useAccountTransactionsInfinity } from '@/hooks/query';
import { useFlattenInfinityPages } from '@/hooks/utils';

export interface AccountTransactionsAllContextValue {
  cashflowTransactions: BankingTransactionResponse[];
  isCashFlowTransactionsFetching: boolean;
  isCashFlowTransactionsLoading: boolean;
}

interface AccountTransactionsAllProviderProps {
  children: React.ReactNode;
}

const AccountTransactionsAllBootContext =
  React.createContext<AccountTransactionsAllContextValue>(
    {} as AccountTransactionsAllContextValue,
  );

/**
 * Account transctions all provider.
 */
function AccountTransactionsAllProvider({
  children,
}: AccountTransactionsAllProviderProps) {
  const { accountId } = useAccountTransactionsContext();

  // Fetch cashflow account transactions list
  const {
    data: cashflowTransactionsPages,
    isFetching: isCashFlowTransactionsFetching,
    isLoading: isCashFlowTransactionsLoading,
    isSuccess: isCashflowTransactionsSuccess,
    fetchNextPage: fetchNextTransactionsPage,
    hasNextPage: hasCashflowTransactionsNextPgae,
  } = useAccountTransactionsInfinity(accountId, {
    accountId,
    pageSize: 50,
  });
  // Memorized the cashflow account transactions.
  const cashflowTransactions = useFlattenInfinityPages(
    isCashflowTransactionsSuccess ? cashflowTransactionsPages : undefined,
    (page) => page?.transactions ?? [],
  );
  // Handle the observer inersection.
  const handleObserverInteract = React.useCallback(() => {
    if (!isCashFlowTransactionsFetching && hasCashflowTransactionsNextPgae) {
      fetchNextTransactionsPage();
    }
  }, [
    isCashFlowTransactionsFetching,
    hasCashflowTransactionsNextPgae,
    fetchNextTransactionsPage,
  ]);
  // Provider payload.
  const provider: AccountTransactionsAllContextValue = {
    cashflowTransactions: cashflowTransactions ?? [],
    isCashFlowTransactionsFetching,
    isCashFlowTransactionsLoading,
  };

  return (
    <AccountTransactionsAllBootContext.Provider value={provider}>
      {children}
      <IntersectionObserver onIntersect={handleObserverInteract} />
    </AccountTransactionsAllBootContext.Provider>
  );
}

const useAccountTransactionsAllContext = () =>
  React.useContext(AccountTransactionsAllBootContext);

export { AccountTransactionsAllProvider, useAccountTransactionsAllContext };

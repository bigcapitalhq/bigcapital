// @ts-nocheck
import React from 'react';
import { flatten, map } from 'lodash';
import { IntersectionObserver } from '@/components';
import { useAccountTransactionsInfinity } from '@/hooks/query';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';

const AccountTransactionsAllBootContext = React.createContext();

function flattenInfinityPages(data) {
  return flatten(map(data.pages, (page) => page.transactions));
}

interface AccountTransactionsAllPoviderProps {
  children: React.ReactNode;
}

/**
 * Account transctions all provider.
 */
function AccountTransactionsAllProvider({
  children,
}: AccountTransactionsAllPoviderProps) {
  const { accountId } = useAccountTransactionsContext();

  // Fetch cashflow account transactions list
  const {
    data: cashflowTransactionsPages,
    isFetching: isCashFlowTransactionsFetching,
    isLoading: isCashFlowTransactionsLoading,
    isSuccess: isCashflowTransactionsSuccess,
    fetchNextPage: fetchNextTransactionsPage,
    isFetchingNextPage: isCashflowTransactionsFetchingNextPage,
    hasNextPage: hasCashflowTransactionsNextPgae,
  } = useAccountTransactionsInfinity(accountId, {
    page_size: 50,
    account_id: accountId,
  });
  // Memorized the cashflow account transactions.
  const cashflowTransactions = React.useMemo(
    () =>
      isCashflowTransactionsSuccess
        ? flattenInfinityPages(cashflowTransactionsPages)
        : [],
    [cashflowTransactionsPages, isCashflowTransactionsSuccess],
  );
  // Handle the observer ineraction.
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
  const provider = {
    cashflowTransactions,
    isCashFlowTransactionsFetching,
    isCashFlowTransactionsLoading,
  };

  return (
    <AccountTransactionsAllBootContext.Provider value={provider}>
      {children}
      <IntersectionObserver
        onIntersect={handleObserverInteract}
        enabled={!isCashflowTransactionsFetchingNextPage}
      />
    </AccountTransactionsAllBootContext.Provider>
  );
}

const useAccountTransactionsAllContext = () =>
  React.useContext(AccountTransactionsAllBootContext);

export { AccountTransactionsAllProvider, useAccountTransactionsAllContext };

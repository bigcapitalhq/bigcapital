// @ts-nocheck

import React from 'react';
import { flatten, map } from 'lodash';
import { IntersectionObserver } from '@/components';
import { useAccountUncategorizedTransactionsInfinity } from '@/hooks/query';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';

const AccountUncategorizedTransactionsContext = React.createContext();

function flattenInfinityPagesData(data) {
  return flatten(map(data.pages, (page) => page.data));
}

/**
 * Account uncategorized transctions provider.
 */
function AccountUncategorizedTransactionsBoot({ children }) {
  const { accountId } = useAccountTransactionsContext();

  // Fetches the uncategorized transactions.
  const {
    data: uncategorizedTransactionsPage,
    isFetching: isUncategorizedTransactionFetching,
    isLoading: isUncategorizedTransactionsLoading,
    isSuccess: isUncategorizedTransactionsSuccess,
    isFetchingNextPage: isUncategorizedTransactionFetchNextPage,
    fetchNextPage: fetchNextUncategorizedTransactionsPage,
    hasNextPage: hasUncategorizedTransactionsNextPage,
  } = useAccountUncategorizedTransactionsInfinity(accountId, {
    page_size: 50,
  });
  // Memorized the cashflow account transactions.
  const uncategorizedTransactions = React.useMemo(
    () =>
      isUncategorizedTransactionsSuccess
        ? flattenInfinityPagesData(uncategorizedTransactionsPage)
        : [],
    [uncategorizedTransactionsPage, isUncategorizedTransactionsSuccess],
  );
  // Handle the observer ineraction.
  const handleObserverInteract = React.useCallback(() => {
    if (
      !isUncategorizedTransactionFetching &&
      hasUncategorizedTransactionsNextPage
    ) {
      fetchNextUncategorizedTransactionsPage();
    }
  }, [
    isUncategorizedTransactionFetching,
    hasUncategorizedTransactionsNextPage,
    fetchNextUncategorizedTransactionsPage,
  ]);
  // Provider payload.
  const provider = {
    uncategorizedTransactions,
    isUncategorizedTransactionFetching,
    isUncategorizedTransactionsLoading,
  };

  return (
    <AccountUncategorizedTransactionsContext.Provider value={provider}>
      {children}
      <IntersectionObserver
        onIntersect={handleObserverInteract}
        enabled={!isUncategorizedTransactionFetchNextPage}
      />
    </AccountUncategorizedTransactionsContext.Provider>
  );
}

const useAccountUncategorizedTransactionsContext = () =>
  React.useContext(AccountUncategorizedTransactionsContext);

export {
  AccountUncategorizedTransactionsBoot,
  useAccountUncategorizedTransactionsContext,
};

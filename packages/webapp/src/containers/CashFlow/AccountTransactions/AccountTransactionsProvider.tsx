// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { flatten, map } from 'lodash';
import { IntersectionObserver, DashboardInsider } from '@/components';
import {
  useAccountTransactionsInfinity,
  useCashflowAccounts,
  useAccount,
  useAccountUncategorizedTransactionsInfinity,
} from '@/hooks/query';
import { useAppQueryString } from '@/hooks';

const AccountTransactionsContext = React.createContext();

function flattenInfinityPages(data) {
  return flatten(map(data.pages, (page) => page.transactions));
}

function flattenInfinityPagesData(data) {
  return flatten(map(data.pages, (page) => page.data));
}

/**
 * Account transctions provider.
 */
function AccountTransactionsProvider({ query, ...props }) {
  const { id } = useParams();
  const accountId = parseInt(id, 10);

  const [locationQuery, setLocationQuery] = useAppQueryString();

  const filterTab = locationQuery?.filter || 'all';
  const setFilterTab = (value: stirng) => {
    setLocationQuery({ filter: value });
  };

  // Fetch cashflow account transactions list
  const {
    data: cashflowTransactionsPages,
    isFetching: isCashFlowTransactionsFetching,
    isLoading: isCashFlowTransactionsLoading,
    isSuccess: isCashflowTransactionsSuccess,
    fetchNextPage: fetchNextTransactionsPage,
    isFetchingNextPage,
    hasNextPage,
  } = useAccountTransactionsInfinity(
    accountId,
    {
      page_size: 50,
      account_id: accountId,
    },
    {
      enabled: filterTab === 'all' || filterTab === 'dashboard',
    },
  );

  const {
    data: uncategorizedTransactionsPage,
    isFetching: isUncategorizedTransactionFetching,
    isLoading: isUncategorizedTransactionsLoading,
    isSuccess: isUncategorizedTransactionsSuccess,
    fetchNextPage: fetchNextUncategorizedTransactionsPage,
  } = useAccountUncategorizedTransactionsInfinity(
    accountId,
    {
      page_size: 50,
    },
    {
      enabled: filterTab === 'uncategorized',
    },
  );

  // Memorized the cashflow account transactions.
  const cashflowTransactions = React.useMemo(
    () =>
      isCashflowTransactionsSuccess
        ? flattenInfinityPages(cashflowTransactionsPages)
        : [],
    [cashflowTransactionsPages, isCashflowTransactionsSuccess],
  );

  // Memorized the cashflow account transactions.
  const uncategorizedTransactions = React.useMemo(
    () =>
      isUncategorizedTransactionsSuccess
        ? flattenInfinityPagesData(uncategorizedTransactionsPage)
        : [],
    [uncategorizedTransactionsPage, isUncategorizedTransactionsSuccess],
  );

  // Fetch cashflow accounts.
  const {
    data: cashflowAccounts,
    isFetching: isCashFlowAccountsFetching,
    isLoading: isCashFlowAccountsLoading,
  } = useCashflowAccounts(query, { keepPreviousData: true });

  // Retrieve specific account details.
  const {
    data: currentAccount,
    isFetching: isCurrentAccountFetching,
    isLoading: isCurrentAccountLoading,
  } = useAccount(accountId, { keepPreviousData: true });

  // Handle the observer ineraction.
  const handleObserverInteract = React.useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextTransactionsPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextTransactionsPage]);

  // Provider payload.
  const provider = {
    accountId,
    cashflowTransactions,
    cashflowAccounts,
    currentAccount,
    isCashFlowTransactionsFetching,
    isCashFlowTransactionsLoading,
    isCashFlowAccountsFetching,
    isCashFlowAccountsLoading,
    isCurrentAccountFetching,
    isCurrentAccountLoading,

    filterTab,
    setFilterTab,

    uncategorizedTransactions,
    isUncategorizedTransactionFetching
  };

  return (
    <DashboardInsider name={'account-transactions'}>
      <AccountTransactionsContext.Provider value={provider} {...props} />
      <IntersectionObserver
        onIntersect={handleObserverInteract}
        enabled={!isFetchingNextPage}
      />
    </DashboardInsider>
  );
}

const useAccountTransactionsContext = () =>
  React.useContext(AccountTransactionsContext);

export { AccountTransactionsProvider, useAccountTransactionsContext };

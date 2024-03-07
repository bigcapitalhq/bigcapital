// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { useCashflowAccounts, useAccount } from '@/hooks/query';
import { useAppQueryString } from '@/hooks';

const AccountTransactionsContext = React.createContext();

/**
 * Account transctions provider.
 */
function AccountTransactionsProvider({ query, ...props }) {
  const { id } = useParams();
  const accountId = parseInt(id, 10);

  const [locationQuery, setLocationQuery] = useAppQueryString();

  const filterTab = locationQuery?.filter || 'all';
  const setFilterTab = (value: string) => {
    setLocationQuery({ filter: value });
  };
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

  // Provider payload.
  const provider = {
    accountId,
    cashflowAccounts,
    currentAccount,

    isCashFlowAccountsFetching,
    isCashFlowAccountsLoading,
    isCurrentAccountFetching,
    isCurrentAccountLoading,

    filterTab,
    setFilterTab,
  };

  return (
    <DashboardInsider name={'account-transactions'}>
      <AccountTransactionsContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useAccountTransactionsContext = () =>
  React.useContext(AccountTransactionsContext);

export { AccountTransactionsProvider, useAccountTransactionsContext };

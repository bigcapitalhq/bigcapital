// @ts-nocheck
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { useCashflowAccounts, useAccount } from '@/hooks/query';
import { useAppQueryString } from '@/hooks';
import { useGetBankAccountSummaryMeta } from '@/hooks/query/bank-rules';

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
  // Retrieves cashflow accounts.
  const {
    data: cashflowAccounts,
    isFetching: isCashFlowAccountsFetching,
    isLoading: isCashFlowAccountsLoading,
  } = useCashflowAccounts(query, { keepPreviousData: true });

  // Retrieves specific account details.
  const {
    data: currentAccount,
    isFetching: isCurrentAccountFetching,
    isLoading: isCurrentAccountLoading,
  } = useAccount(accountId, { keepPreviousData: true });

  // Retrieves the bank account meta summary.
  const {
    data: bankAccountMetaSummary,
    isLoading: isBankAccountMetaSummaryLoading,
    isFetching: isBankAccountMetaSummaryFetching,
  } = useGetBankAccountSummaryMeta(accountId);

  const [scrollableRef, setScrollableRef] = useState();

  // Provider payload.
  const provider = {
    accountId,
    cashflowAccounts,
    currentAccount,
    bankAccountMetaSummary,

    isCashFlowAccountsFetching,
    isCashFlowAccountsLoading,

    isCurrentAccountFetching,
    isCurrentAccountLoading,

    isBankAccountMetaSummaryLoading,
    isBankAccountMetaSummaryFetching,

    filterTab,
    setFilterTab,

    scrollableRef,
    setScrollableRef,
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

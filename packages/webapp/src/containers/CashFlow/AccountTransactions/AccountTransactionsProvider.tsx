import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import type {
  Account,
  BankingAccountsListResponse,
  BankingAccountSummaryResponse,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components';
import { useCashflowAccounts, useAccount } from '@/hooks/query';
import { useAppQueryString } from '@/hooks';
import { useGetBankAccountSummaryMeta } from '@/hooks/query/banking';

type AccountTransactionsContextValue = {
  accountId: number;
  cashflowAccounts: BankingAccountsListResponse;
  currentAccount: Account | undefined;
  bankAccountMetaSummary: BankingAccountSummaryResponse | undefined;
  isCashFlowAccountsFetching: boolean;
  isCashFlowAccountsLoading: boolean;
  isCurrentAccountFetching: boolean;
  isCurrentAccountLoading: boolean;
  isBankAccountMetaSummaryLoading: boolean;
  isBankAccountMetaSummaryFetching: boolean;
  filterTab: string;
  setFilterTab: (value: string) => void;
  scrollableRef: HTMLElement | null | undefined;
  setScrollableRef: React.Dispatch<
    React.SetStateAction<HTMLElement | null | undefined>
  >;
};

type AccountTransactionsProviderProps = {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
};

const AccountTransactionsContext = React.createContext<
  AccountTransactionsContextValue | undefined
>(undefined);

/**
 * Account transctions provider.
 */
function AccountTransactionsProvider({
  query,
  ...props
}: AccountTransactionsProviderProps) {
  const { id } = useParams<{ id: string }>();
  const accountId = parseInt(id!, 10);

  const [locationQuery, setLocationQuery] = useAppQueryString();

  const filterTab = locationQuery?.filter || 'all';
  const setFilterTab = (value: string) => {
    setLocationQuery({ filter: value });
  };
  // Retrieves cashflow accounts.
  const {
    data: cashflowAccountsData,
    isFetching: isCashFlowAccountsFetching,
    isLoading: isCashFlowAccountsLoading,
  } = useCashflowAccounts(query, {
    placeholderData: (previousData) => previousData,
  });
  const cashflowAccounts = cashflowAccountsData as
    | BankingAccountsListResponse
    | undefined;

  // Retrieves specific account details.
  const {
    data: currentAccount,
    isFetching: isCurrentAccountFetching,
    isLoading: isCurrentAccountLoading,
  } = useAccount(accountId);

  // Retrieves the bank account meta summary.
  const {
    data: bankAccountMetaSummary,
    isLoading: isBankAccountMetaSummaryLoading,
    isFetching: isBankAccountMetaSummaryFetching,
  } = useGetBankAccountSummaryMeta(accountId);

  const [scrollableRef, setScrollableRef] = useState<
    HTMLElement | null | undefined
  >();

  // Provider payload.
  const provider: AccountTransactionsContextValue = {
    accountId,
    cashflowAccounts: cashflowAccounts ?? [],
    currentAccount,
    bankAccountMetaSummary,

    isCashFlowAccountsFetching: isCashFlowAccountsFetching ?? false,
    isCashFlowAccountsLoading: isCashFlowAccountsLoading ?? false,

    isCurrentAccountFetching: isCurrentAccountFetching ?? false,
    isCurrentAccountLoading: isCurrentAccountLoading ?? false,

    isBankAccountMetaSummaryLoading: isBankAccountMetaSummaryLoading ?? false,
    isBankAccountMetaSummaryFetching: isBankAccountMetaSummaryFetching ?? false,

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

const useAccountTransactionsContext = (): AccountTransactionsContextValue => {
  const ctx = React.useContext(AccountTransactionsContext);
  if (!ctx) {
    throw new Error(
      'useAccountTransactionsContext must be used within AccountTransactionsProvider',
    );
  }
  return ctx;
};

export { AccountTransactionsProvider, useAccountTransactionsContext };

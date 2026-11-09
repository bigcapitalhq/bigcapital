import { keepPreviousData } from '@tanstack/react-query';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useParams } from 'react-router-dom';
import type {
  Account,
  BankingAccountSummaryResponse,
  BankingAccountsListResponse,
  SettingsGroup,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components';
import { useAppQueryString } from '@/hooks';
import {
  useCashflowAccounts,
  useAccount,
  useSettingsCashflowTransactions,
} from '@/hooks/query';
import { useGetBankAccountSummaryMeta } from '@/hooks/query/banking';

/**
 * `BankingAccountSummaryResponse` SDK type only declares name + uncategorized +
 * recognized counts. Runtime sends more fields; surface them as optional so
 * consumers can read them without per-file casts.
 */
export type BankAccountSummaryMeta = BankingAccountSummaryResponse & {
  totalExcludedTransactions?: number;
  totalPendingTransactions?: number;
};

export interface AccountTransactionsContextValue {
  accountId: number;
  cashflowAccounts: BankingAccountsListResponse;
  currentAccount?: Account;
  bankAccountMetaSummary?: BankAccountSummaryMeta;
  cashflowTransactionsSettings: SettingsGroup | undefined;

  isCashFlowAccountsFetching: boolean;
  isCashFlowAccountsLoading: boolean;
  isCurrentAccountFetching: boolean;
  isCurrentAccountLoading: boolean;

  isBankAccountMetaSummaryLoading: boolean;
  isBankAccountMetaSummaryFetching: boolean;

  filterTab: string;
  setFilterTab: (value: string) => void;

  scrollableRef: HTMLElement | null;
  setScrollableRef: Dispatch<SetStateAction<HTMLElement | null>>;
}

interface AccountTransactionsProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

const AccountTransactionsContext =
  React.createContext<AccountTransactionsContextValue>(
    {} as AccountTransactionsContextValue,
  );

/**
 * Account transctions provider.
 */
function AccountTransactionsProvider({
  query,
  children,
}: AccountTransactionsProviderProps) {
  const { id } = useParams<{ id: string }>();
  const accountId = parseInt(id ?? '', 10);

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
  } = useCashflowAccounts(query, { placeholderData: keepPreviousData });

  // Retrieves specific account details.
  const {
    data: currentAccount,
    isFetching: isCurrentAccountFetching,
    isLoading: isCurrentAccountLoading,
  } = useAccount(accountId, { placeholderData: keepPreviousData });

  // Retrieves the bank account meta summary.
  const {
    data: bankAccountMetaSummary,
    isLoading: isBankAccountMetaSummaryLoading,
    isFetching: isBankAccountMetaSummaryFetching,
  } = useGetBankAccountSummaryMeta(accountId);

  // Retrieves cashflow transactions settings.
  const { data: cashflowTransactionsSettings } =
    useSettingsCashflowTransactions();

  const [scrollableRef, setScrollableRef] = useState<HTMLElement | null>(null);

  // Provider payload.
  const provider: AccountTransactionsContextValue = {
    accountId,
    cashflowAccounts: cashflowAccounts ?? [],
    currentAccount,
    bankAccountMetaSummary,
    cashflowTransactionsSettings,

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
      <AccountTransactionsContext.Provider value={provider}>
        {children}
      </AccountTransactionsContext.Provider>
    </DashboardInsider>
  );
}

const useAccountTransactionsContext = () =>
  React.useContext(AccountTransactionsContext);

export { AccountTransactionsProvider, useAccountTransactionsContext };

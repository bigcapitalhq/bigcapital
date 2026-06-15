import React from 'react';
import type { BankingAccountsListResponse } from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import { useCashflowAccounts } from '@/hooks/query';
import { transformAccountsStateToQuery } from './utils';

type CashFlowAccountsContextValue = {
  cashflowAccounts: BankingAccountsListResponse | undefined;
  isCashFlowAccountsFetching: boolean;
  isCashFlowAccountsLoading: boolean;
};

type CashFlowAccountsProviderProps = {
  tableState: Record<string, unknown>;
  children?: React.ReactNode;
};

const CashFlowAccountsContext = React.createContext<
  CashFlowAccountsContextValue | undefined
>(undefined);

/**
 * Cash Flow data provider.
 */
function CashFlowAccountsProvider({
  tableState,
  ...props
}: CashFlowAccountsProviderProps) {
  const query = transformAccountsStateToQuery(tableState);

  // Fetch cash flow list .
  const {
    data: cashflowAccountsData,
    isFetching: isCashFlowAccountsFetching,
    isLoading: isCashFlowAccountsLoading,
  } = useCashflowAccounts(query);

  const cashflowAccounts = cashflowAccountsData as
    | BankingAccountsListResponse
    | undefined;

  // Provider payload.
  const provider: CashFlowAccountsContextValue = {
    cashflowAccounts,
    isCashFlowAccountsFetching: isCashFlowAccountsFetching ?? false,
    isCashFlowAccountsLoading: isCashFlowAccountsLoading ?? false,
  };

  return (
    <DashboardInsider name={'cashflow-accounts'}>
      <CashFlowAccountsContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useCashFlowAccountsContext = (): CashFlowAccountsContextValue => {
  const ctx = React.useContext(CashFlowAccountsContext);
  if (!ctx) {
    throw new Error(
      'useCashFlowAccountsContext must be used within CashFlowAccountsProvider',
    );
  }
  return ctx;
};

export { CashFlowAccountsProvider, useCashFlowAccountsContext };

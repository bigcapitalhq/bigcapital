import { keepPreviousData } from '@tanstack/react-query';
import React from 'react';
import { transformAccountsStateToQuery } from './utils';
import type { WithCashflowAccountsProps } from '@/containers/CashFlow/AccountTransactions/withCashflowAccounts';
import type { BankingAccountsListResponse } from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import { useCashflowAccounts } from '@/hooks/query';

export interface CashFlowAccountsContextValue {
  cashflowAccounts?: BankingAccountsListResponse;
  isCashFlowAccountsFetching: boolean;
  isCashFlowAccountsLoading: boolean;
}

interface CashFlowAccountsProviderProps {
  tableState: WithCashflowAccountsProps['cashflowAccountsTableState'];
  children?: React.ReactNode;
}

const CashFlowAccountsContext =
  React.createContext<CashFlowAccountsContextValue>(
    {} as CashFlowAccountsContextValue,
  );

/**
 * Cash Flow data provider.
 */
function CashFlowAccountsProvider({
  tableState,
  children,
}: CashFlowAccountsProviderProps) {
  const query = transformAccountsStateToQuery(tableState);

  // Fetch cash flow list .
  const {
    data: cashflowAccounts,
    isFetching: isCashFlowAccountsFetching,
    isLoading: isCashFlowAccountsLoading,
  } = useCashflowAccounts(query, { placeholderData: keepPreviousData });

  // Provider payload.
  const provider: CashFlowAccountsContextValue = {
    cashflowAccounts,
    isCashFlowAccountsFetching,
    isCashFlowAccountsLoading,
  };

  return (
    <DashboardInsider name={'cashflow-accounts'}>
      <CashFlowAccountsContext.Provider value={provider}>
        {children}
      </CashFlowAccountsContext.Provider>
    </DashboardInsider>
  );
}

const useCashFlowAccountsContext = () =>
  React.useContext(CashFlowAccountsContext);

export { CashFlowAccountsProvider, useCashFlowAccountsContext };

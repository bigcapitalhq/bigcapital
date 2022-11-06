// @ts-nocheck
import React from 'react';
import { DashboardInsider } from '@/components/Dashboard';

import { useCashflowAccounts } from '@/hooks/query';
import { transformAccountsStateToQuery } from './utils';

const CashFlowAccountsContext = React.createContext();

/**
 * Cash Flow data provider.
 */
function CashFlowAccountsProvider({ tableState, ...props }) {
  const query = transformAccountsStateToQuery(tableState);

  // Fetch cash flow list .
  const {
    data: cashflowAccounts,
    isFetching: isCashFlowAccountsFetching,
    isLoading: isCashFlowAccountsLoading,
  } = useCashflowAccounts(query, { keepPreviousData: true });

  // Provider payload.
  const provider = {
    cashflowAccounts,
    isCashFlowAccountsFetching,
    isCashFlowAccountsLoading,
  };

  return (
    <DashboardInsider name={'cashflow-accounts'}>
      <CashFlowAccountsContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useCashFlowAccountsContext = () =>
  React.useContext(CashFlowAccountsContext);

export { CashFlowAccountsProvider, useCashFlowAccountsContext };

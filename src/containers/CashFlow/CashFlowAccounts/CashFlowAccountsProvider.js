import React from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import { useCashflowAccounts } from 'hooks/query';

const CashFlowAccountsContext = React.createContext();

/**
 * Cash Flow data provider.
 */
function CashFlowAccountsProvider({ query, tableStateChanged, ...props }) {
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

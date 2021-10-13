import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import { useCashflowTransactions } from 'hooks/query';

const AccountTransactionsContext = React.createContext();

/**
 * Account transctions provider.
 */
function AccountTransactionsProvider({ query, ...props }) {
  const accountId = useParams();

  // Fetch cashflow account transactions list
  const {
    data: cashflowTransactions,
    isFetching: isCashFlowTransactionsFetching,
    isLoading: isCashFlowTransactionsLoading,
  } = useCashflowTransactions(accountId, {
    enabled: !!accountId,
  });


  // Provider payload.
  const provider = {
    accountId,
    cashflowTransactions,
    isCashFlowTransactionsFetching,
    isCashFlowTransactionsLoading,
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

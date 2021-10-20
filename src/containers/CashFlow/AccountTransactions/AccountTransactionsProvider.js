import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useCashflowTransactions,
  useCashflowAccounts,
  useAccount,
} from 'hooks/query';

const AccountTransactionsContext = React.createContext();

/**
 * Account transctions provider.
 */
function AccountTransactionsProvider({ query, ...props }) {
  const { id } = useParams();
  const accountId = parseInt(id, 10);

  // Fetch cashflow account transactions list
  const {
    data: cashflowTransactions,
    isFetching: isCashFlowTransactionsFetching,
    isLoading: isCashFlowTransactionsLoading,
  } = useCashflowTransactions(accountId, {
    enabled: !!accountId,
  });

  // Fetch cashflow accounts .
  const {
    data: cashflowAccounts,
    isFetching: isCashFlowAccountsFetching,
    isLoading: isCashFlowAccountsLoading,
  } = useCashflowAccounts(query, { keepPreviousData: true });

  const {
    data: currentAccount,
    isFetching: isCurrentAccountFetching,
    isLoading: isCurrentAccountLoading,
  } = useAccount(accountId, { keepPreviousData: true });

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

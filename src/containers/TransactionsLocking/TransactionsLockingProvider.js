import React from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useTransactionsLocking } from 'hooks/query';

const TransactionsLockingContext = React.createContext();

/**
 * Transactions locking data provider.
 */
function TransactionsLockingProvider({ ...props }) {
  // Fetch
  const {
    data: transactionsLocking,
    isFetching: isTransactionLockingFetching,
    isLoading: isTransactionLockingLoading,
  } = useTransactionsLocking();

  console.log(transactionsLocking, 'XX');

  // Provider
  const provider = {
    transactionsLocking,
  };

  return (
    <DashboardInsider loading={isTransactionLockingLoading}>
      <TransactionsLockingContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useTransactionsLockingContext = () =>
  React.useContext(TransactionsLockingContext);

export { TransactionsLockingProvider, useTransactionsLockingContext };

import React from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useTransactionsLocking } from 'hooks/query';

const TransactionsLockingContext = React.createContext();

/**
 * Transactions locking data provider.
 */
function TransactionsLockingProvider({ ...props }) {
  // Fetch transaction locking modules list.
  const {
    data: transactionsLocking,
    isFetching: isTransactionLockingFetching,
    isLoading: isTransactionLockingLoading,
  } = useTransactionsLocking();

  const [transactionLockingType, setTransactionLockingType] =
    React.useState('partial');

  // Provider
  const provider = {
    transactionsLocking,
    isTransactionLockingFetching,
    isTransactionLockingLoading,

    transactionLockingType,
    setTransactionLockingType,
  };

  return (
    <DashboardInsider>
      <TransactionsLockingContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useTransactionsLockingContext = () =>
  React.useContext(TransactionsLockingContext);

export { TransactionsLockingProvider, useTransactionsLockingContext };

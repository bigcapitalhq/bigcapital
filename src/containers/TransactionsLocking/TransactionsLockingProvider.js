import React from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

const TransactionsLockingContext = React.createContext();

/**
 * Transactions locking data provider.
 */
function TransactionsLockingProvider({ ...props }) {
  // Provider
  const provider = {};

  return (
    <DashboardInsider
    // loading={}
    >
      <TransactionsLockingContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useTransactionsLockingContext = () =>
  React.useContext(TransactionsLockingContext);

export { TransactionsLockingProvider, useTransactionsLockingContext };

import React from 'react';
import type {
  TransactionsLockingListResponse,
  TransactionsLockingType,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import { useTransactionsLocking } from '@/hooks/query';
import { useWatchImmediate } from '@/hooks/utils/useWatch';

export interface TransactionsLockingContextValue {
  transactionsLocking: TransactionsLockingListResponse | undefined;
  isTransactionLockingFetching: boolean;
  isTransactionLockingLoading: boolean;
  transactionLockingType: TransactionsLockingType;
  setTransactionLockingType: React.Dispatch<
    React.SetStateAction<TransactionsLockingType>
  >;
}

const TransactionsLockingContext = React.createContext<
  TransactionsLockingContextValue | undefined
>(undefined);

interface TransactionsLockingProviderProps {
  children?: React.ReactNode;
}

/**
 * Transactions locking data provider.
 */
function TransactionsLockingProvider({
  children,
}: TransactionsLockingProviderProps) {
  // Fetch transaction locking modules list.
  const {
    data: transactionsLocking,
    isFetching: isTransactionLockingFetching,
    isLoading: isTransactionLockingLoading,
  } = useTransactionsLocking();

  // Transactions locking type.
  const [transactionLockingType, setTransactionLockingType] =
    React.useState<TransactionsLockingType>('partial');

  // Locking type controlled from response.
  useWatchImmediate(() => {
    if (transactionsLocking?.lockingType) {
      setTransactionLockingType(transactionsLocking.lockingType);
    }
  }, transactionsLocking?.lockingType);

  // Provider
  const provider: TransactionsLockingContextValue = {
    transactionsLocking,
    isTransactionLockingFetching,
    isTransactionLockingLoading,

    transactionLockingType,
    setTransactionLockingType,
  };

  return (
    <DashboardInsider>
      <TransactionsLockingContext.Provider value={provider}>
        {children}
      </TransactionsLockingContext.Provider>
    </DashboardInsider>
  );
}

const useTransactionsLockingContext = (): TransactionsLockingContextValue => {
  const context = React.useContext(TransactionsLockingContext);

  if (!context) {
    throw new Error(
      'useTransactionsLockingContext must be used within a TransactionsLockingProvider',
    );
  }
  return context;
};

export { TransactionsLockingProvider, useTransactionsLockingContext };

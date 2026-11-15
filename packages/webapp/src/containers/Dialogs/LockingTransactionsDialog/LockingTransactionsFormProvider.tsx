import React, { createContext } from 'react';
import type { LockingTransactionsContextValue } from './types';
import { DialogContent } from '@/components';
import {
  useCreateLockingTransactoin,
  useEditTransactionsLocking,
} from '@/hooks/query';

const LockingTransactionsContext =
  createContext<LockingTransactionsContextValue>(
    {} as LockingTransactionsContextValue,
  );

interface LockingTransactionsFormProviderProps {
  moduleName: string;
  isEnabled: boolean;
  dialogName: string;
  lockToDate?: string;
  children?: React.ReactNode;
}

/**
 * Locking transactions form provider.
 */
function LockingTransactionsFormProvider({
  moduleName,
  isEnabled,
  dialogName,
  lockToDate,
  ...props
}: LockingTransactionsFormProviderProps) {
  // Create locking transactions mutations.
  const { mutateAsync: createLockingTransactionMutate } =
    useCreateLockingTransactoin();

  const { data: transactionLocking, isLoading: isTransactionsLockingLoading } =
    useEditTransactionsLocking(moduleName, {
      enabled: !!isEnabled,
    });

  // State provider.
  const provider: LockingTransactionsContextValue = {
    dialogName,
    moduleName,
    createLockingTransactionMutate,
    transactionLocking,
    isEnabled,
    lockToDate,
  };
  return (
    <DialogContent isLoading={isTransactionsLockingLoading}>
      <LockingTransactionsContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useLockingTransactionsContext = () =>
  React.useContext(LockingTransactionsContext);

export { LockingTransactionsFormProvider, useLockingTransactionsContext };

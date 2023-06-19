// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import {
  useCreateLockingTransaction,
  useEditTransactionsLocking,
} from '@/hooks/query';

const LockingTransactionsContext = React.createContext();

/**
 * Locking transactions form provider.
 */
function LockingTransactionsFormProvider({
  moduleName,
  isEnabled,
  dialogName,
  ...props
}) {
  // Create locking transactions mutations.
  const { mutateAsync: createLockingTransactionMutate } =
    useCreateLockingTransaction();

  const { data: transactionLocking, isLoading: isTransactionsLockingLoading } =
    useEditTransactionsLocking(moduleName, {
      enabled: !!isEnabled,
    });

  // State provider.
  const provider = {
    dialogName,
    moduleName,
    createLockingTransactionMutate,
    transactionLocking,
    isEnabled,
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

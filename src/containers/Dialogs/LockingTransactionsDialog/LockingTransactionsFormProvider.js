import React from 'react';
import { DialogContent } from 'components';
import { useCreateLockingTransactoin } from 'hooks/query';

const LockingTransactionsContext = React.createContext();

/**
 * Locking transactions form provider.
 */
function LockingTransactionsFormProvider({ dialogName, ...props }) {
  
  // Create locking transactions mutations.
  const { mutateAsync: createLockingTransactionMutate } =
  useCreateLockingTransactoin();

  // State provider.
  const provider = {
    dialogName,
    createLockingTransactionMutate,
  };
  return (
    <DialogContent>
      <LockingTransactionsContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useLockingTransactionsContext = () =>
  React.useContext(LockingTransactionsContext);

export { LockingTransactionsFormProvider, useLockingTransactionsContext };

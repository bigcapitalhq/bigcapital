// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { useCancelLockingTransaction } from '@/hooks/query';

const UnlockingTransactionsContext = React.createContext();

/**
 * Unlocking transactions form provider.
 */
function UnlockingTransactionsFormProvider({
  moduleName,
  dialogName,
  ...props
}) {
  // Cancel locking transactions mutations.
  const { mutateAsync: cancelLockingTransactionMutate } =
    useCancelLockingTransaction();

  // State provider.
  const provider = {
    dialogName,
    moduleName,
    cancelLockingTransactionMutate,
  };

  return (
    <DialogContent>
      <UnlockingTransactionsContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useUnlockingTransactionsContext = () =>
  React.useContext(UnlockingTransactionsContext);

export { useUnlockingTransactionsContext, UnlockingTransactionsFormProvider };

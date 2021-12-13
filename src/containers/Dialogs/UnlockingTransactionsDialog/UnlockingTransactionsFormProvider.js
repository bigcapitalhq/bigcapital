import React from 'react';
import { DialogContent } from 'components';
import {
  useCancelLockingTransaction,
  useCancelUnlockingPartialTransactions,
} from 'hooks/query';

const UnlockingTransactionsContext = React.createContext();

/**
 * Unlocking transactions form provider.
 */
function UnlockingTransactionsFormProvider({ moduleName, dialogName, ...props }) {
  // Cancle locking transactions mutations.
  const { mutateAsync: cancelLockingTransactionMutate } =
    useCancelLockingTransaction();

  // Cancel unlocking partial transactions mutations.
  const { mutateAsync: cancelUnLockingPartialTransactionMutate } =
    useCancelUnlockingPartialTransactions();

  // State provider.
  const provider = {
    dialogName,
    moduleName,
    cancelLockingTransactionMutate,
    cancelUnLockingPartialTransactionMutate,
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

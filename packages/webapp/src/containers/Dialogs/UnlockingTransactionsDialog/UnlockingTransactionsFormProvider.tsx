import React, { createContext } from 'react';
import type { UnlockingTransactionsContextValue } from './types';
import { DialogContent } from '@/components';
import { useCancelLockingTransaction } from '@/hooks/query';

const UnlockingTransactionsContext =
  createContext<UnlockingTransactionsContextValue>(
    {} as UnlockingTransactionsContextValue,
  );

interface UnlockingTransactionsFormProviderProps {
  moduleName: string;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Unlocking transactions form provider.
 */
function UnlockingTransactionsFormProvider({
  moduleName,
  dialogName,
  ...props
}: UnlockingTransactionsFormProviderProps) {
  // Cancle locking transactions mutations.
  const { mutateAsync: cancelLockingTransactionMutate } =
    useCancelLockingTransaction();

  // State provider.
  const provider: UnlockingTransactionsContextValue = {
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

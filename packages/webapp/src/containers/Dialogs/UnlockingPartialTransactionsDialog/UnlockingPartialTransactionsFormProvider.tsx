import React, { createContext } from 'react';
import type { UnlockingPartialTransactionsContextValue } from './types';
import { DialogContent } from '@/components';
import { useCreateUnlockingPartialTransactions } from '@/hooks/query';

const UnlockingPartialTransactionsContext =
  createContext<UnlockingPartialTransactionsContextValue>(
    {} as UnlockingPartialTransactionsContextValue,
  );

interface UnlockingPartialTransactionsFormProviderProps {
  moduleName: string;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Unlocking partial transactions form provider.
 */
function UnlockingPartialTransactionsFormProvider({
  moduleName,
  dialogName,
  ...props
}: UnlockingPartialTransactionsFormProviderProps) {
  // Create unlocking partial transactions mutations.
  const { mutateAsync: createUnlockingPartialTransactionsMutate } =
    useCreateUnlockingPartialTransactions();

  // State provider.
  const provider: UnlockingPartialTransactionsContextValue = {
    dialogName,
    moduleName,
    createUnlockingPartialTransactionsMutate,
  };

  return (
    <DialogContent>
      <UnlockingPartialTransactionsContext.Provider
        value={provider}
        {...props}
      />
    </DialogContent>
  );
}

const useUnlockingPartialTransactionsContext = () =>
  React.useContext(UnlockingPartialTransactionsContext);

export {
  UnlockingPartialTransactionsFormProvider,
  useUnlockingPartialTransactionsContext,
};

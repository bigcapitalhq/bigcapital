// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { useCreateUnlockingPartialTransactions } from '@/hooks/query';

const UnlockingPartialTransactionsContext = React.createContext();

/**
 * Unlocking partial transactions form provider.
 */
function UnlockingPartialTransactionsFormProvider({
  moduleName,
  dialogName,
  ...props
}) {
  // Create unlocking partial transactions mutations.
  const { mutateAsync: createUnlockingPartialTransactionsMutate } =
    useCreateUnlockingPartialTransactions();

  // State provider.
  const provider = {
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

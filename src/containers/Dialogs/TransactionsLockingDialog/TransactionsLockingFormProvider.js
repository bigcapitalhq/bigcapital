import React from 'react';
import { DialogContent } from 'components';

const TransactionsLockingContext = React.createContext();

function TransactionsLockingFormProvider({ dialogName, ...props }) {
  // State provider.
  const provider = {
    dialogName,
  };
  return (
    <DialogContent>
      <TransactionsLockingContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useTransactionLockingContext = () =>
  React.useContext(TransactionsLockingContext);

export { TransactionsLockingFormProvider, useTransactionLockingContext };

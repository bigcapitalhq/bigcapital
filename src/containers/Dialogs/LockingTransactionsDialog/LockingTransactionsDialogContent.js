import React from 'react';
import { LockingTransactionsFormProvider } from './LockingTransactionsFormProvider';
import LockingTransactionsForm from './LockingTransactionsForm';

/**
 * Locking transactions dialog content.
 */
export default function LockingTransactionsDialogContent({
  // #ownProps
  dialogName,
  moduleName,
}) {
  return (
    <LockingTransactionsFormProvider moduleName={moduleName} dialogName={dialogName}>
      <LockingTransactionsForm />
    </LockingTransactionsFormProvider>
  );
}

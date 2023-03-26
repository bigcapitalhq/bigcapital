// @ts-nocheck
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
  isEnabled,
}) {

  return (
    <LockingTransactionsFormProvider
      isEnabled={isEnabled}
      moduleName={moduleName}
      dialogName={dialogName}
    >
      <LockingTransactionsForm />
    </LockingTransactionsFormProvider>
  );
}

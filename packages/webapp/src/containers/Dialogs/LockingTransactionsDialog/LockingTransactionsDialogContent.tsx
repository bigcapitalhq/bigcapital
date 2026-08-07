import React from 'react';
import { LockingTransactionsForm } from './LockingTransactionsForm';
import { LockingTransactionsFormProvider } from './LockingTransactionsFormProvider';

interface LockingTransactionsDialogContentProps {
  dialogName: string;
  moduleName: string;
  isEnabled: boolean;
}

/**
 * Locking transactions dialog content.
 */
export function LockingTransactionsDialogContent({
  dialogName,
  moduleName,
  isEnabled,
}: LockingTransactionsDialogContentProps): React.ReactElement {
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

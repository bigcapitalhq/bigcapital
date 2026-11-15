import React from 'react';
import { LockingTransactionsForm } from './LockingTransactionsForm';
import { LockingTransactionsFormProvider } from './LockingTransactionsFormProvider';

interface LockingTransactionsDialogContentProps {
  dialogName: string;
  moduleName: string;
  isEnabled: boolean;
  lockToDate?: string;
}

/**
 * Locking transactions dialog content.
 */
export function LockingTransactionsDialogContent({
  dialogName,
  moduleName,
  isEnabled,
  lockToDate,
}: LockingTransactionsDialogContentProps): React.ReactElement {
  return (
    <LockingTransactionsFormProvider
      isEnabled={isEnabled}
      moduleName={moduleName}
      dialogName={dialogName}
      lockToDate={lockToDate}
    >
      <LockingTransactionsForm />
    </LockingTransactionsFormProvider>
  );
}

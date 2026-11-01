import React from 'react';
import { UnlockingTransactionsForm } from './UnlockingTransactionsForm';
import { UnlockingTransactionsFormProvider } from './UnlockingTransactionsFormProvider';

interface UnlockingTransactionsDialogContentProps {
  moduleName: string;
  dialogName: string;
}

export function UnlockingTransactionsDialogContent({
  moduleName,
  dialogName,
}: UnlockingTransactionsDialogContentProps): React.ReactElement {
  return (
    <UnlockingTransactionsFormProvider
      moduleName={moduleName}
      dialogName={dialogName}
    >
      <UnlockingTransactionsForm />
    </UnlockingTransactionsFormProvider>
  );
}

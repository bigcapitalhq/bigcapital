import React from 'react';
import { UnlockingPartialTransactionsForm } from './UnlockingPartialTransactionsForm';
import { UnlockingPartialTransactionsFormProvider } from './UnlockingPartialTransactionsFormProvider';

interface UnlockingPartialTransactionsDialogContentProps {
  moduleName: string;
  dialogName: string;
}

/**
 * Unlocking partail transactions dialog content.
 */
export function UnlockingPartialTransactionsDialogContent({
  moduleName,
  dialogName,
}: UnlockingPartialTransactionsDialogContentProps): React.ReactElement {
  return (
    <UnlockingPartialTransactionsFormProvider
      moduleName={moduleName}
      dialogName={dialogName}
    >
      <UnlockingPartialTransactionsForm />
    </UnlockingPartialTransactionsFormProvider>
  );
}

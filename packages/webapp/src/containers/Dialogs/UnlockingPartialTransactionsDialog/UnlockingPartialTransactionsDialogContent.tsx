// @ts-nocheck
import React from 'react';

import { UnlockingPartialTransactionsFormProvider } from './UnlockingPartialTransactionsFormProvider';
import UnlockingPartialTransactionsForm from './UnlockingPartialTransactionsForm';

/**
 * Unlocking partial transactions dialog content.
 */
export default function UnlockingPartialTransactionsDialogContent({
  // #ownProps
  moduleName,
  dialogName,
}) {
  return (
    <UnlockingPartialTransactionsFormProvider
      moduleName={moduleName}
      dialogName={dialogName}
    >
      <UnlockingPartialTransactionsForm />
    </UnlockingPartialTransactionsFormProvider>
  );
}

// @ts-nocheck
import React from 'react';

import UnlockingTransactionsForm from './UnlockingTransactionsForm';
import { UnlockingTransactionsFormProvider } from './UnlockingTransactionsFormProvider';

export default function UnlockingTransactionsDialogContent({
  // #ownProps
  moduleName,
  dialogName,
}) {
  return (
    <UnlockingTransactionsFormProvider moduleName={moduleName} dialogName={dialogName}>
      <UnlockingTransactionsForm />
    </UnlockingTransactionsFormProvider>
  );
}

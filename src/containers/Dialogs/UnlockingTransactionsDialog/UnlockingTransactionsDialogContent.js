import React from 'react';

import UnlockingTransactionsForm from './UnlockingTransactionsForm';
import { UnlockingTransactionsFormProvider } from './UnlockingTransactionsFormProvider';

export default function UnlockingTransactionsDialogContent({
  // #ownProps
  dialogName,
}) {
  return (
    <UnlockingTransactionsFormProvider dialogName={dialogName}>
      <UnlockingTransactionsForm />
    </UnlockingTransactionsFormProvider>
  );
}

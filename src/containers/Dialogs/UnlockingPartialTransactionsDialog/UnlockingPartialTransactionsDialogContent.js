import React from 'react';

import { UnlockingPartialTransactionsFormProvider } from './UnlockingPartialTransactionsFormProvider';
import UnlockingPartialTransactionsForm from './UnlockingPartialTransactionsForm';

/**
 * Unlocking partail transactions dialog content.
 */
export default function UnlockingPartialTransactionsDialogContent({
  // #ownProps
  dialogName,
}) {
  return (
    <UnlockingPartialTransactionsFormProvider dialogName={dialogName}>
      <UnlockingPartialTransactionsForm />
    </UnlockingPartialTransactionsFormProvider>
  );
}

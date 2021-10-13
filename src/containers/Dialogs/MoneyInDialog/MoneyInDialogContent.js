import React from 'react';

import { MoneyInDialogProvider } from './MoneyInDialogProvider';
import MoneyInDialogForm from './MoneyInDialogForm';

/**
 * Money in dialog content.
 */
export default function MoneyInDialogContent({
  // #ownProps
  dialogName,
  accountId,
  accountType,
}) {
  return (
    <MoneyInDialogProvider accountId={accountId} dialogName={dialogName}>
      <MoneyInDialogForm accountType={accountType} />
    </MoneyInDialogProvider>
  );
}

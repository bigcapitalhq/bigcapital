import React from 'react';
import { MoneyOutProvider } from './MoneyOutProvider';

import OwnerDrawingsForm from './OwnerDrawings/OwnerDrawingsForm';

/**
 * Money out dailog content.
 */
export default function MoneyOutDialogContent({
  // #ownProps
  dialogName,
  accountId,
  accountType,
}) {
  return (
    <MoneyOutProvider accountId={accountId} dialogName={dialogName}>
      <OwnerDrawingsForm />
    </MoneyOutProvider>
  );
}

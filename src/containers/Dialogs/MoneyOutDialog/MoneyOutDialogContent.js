import React from 'react';
import { MoneyOutProvider } from './MoneyOutProvider';
import MoneyOutDialogForm from './MoneyOutDialogForm';

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
      <MoneyOutDialogForm accountType={accountType} />
    </MoneyOutProvider>
  );
}

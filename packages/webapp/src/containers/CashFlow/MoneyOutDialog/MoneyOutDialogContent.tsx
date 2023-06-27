// @ts-nocheck
import React from 'react';
import { MoneyOutProvider } from './MoneyOutDialogProvider';
import MoneyOutForm from './MoneyOutForm';

/**
 * Money out dialog content.
 */
export default function MoneyOutDialogContent({
  // #ownProps
  dialogName,
  accountId,
  accountType,
}) {
  return (
    <MoneyOutProvider
      accountId={accountId}
      accountType={accountType}
      dialogName={dialogName}
    >
      <MoneyOutForm />
    </MoneyOutProvider>
  );
}

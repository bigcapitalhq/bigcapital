import React from 'react';
import { AccountDialogProvider } from './AccountDialogProvider';
import AccountDialogForm from './AccountDialogForm';

/**
 * Account dialog content.
 */
export default function AccountDialogContent({
  dialogName,
  accountId,
  action,
  parentAccountId,
  accountType,
}) {
  return (
    <AccountDialogProvider
      dialogName={dialogName}
      accountId={accountId}
      action={action}
      parentAccountId={parentAccountId}
      accountType={accountType}
    >
      <AccountDialogForm />
    </AccountDialogProvider>
  );
}

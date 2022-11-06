// @ts-nocheck
import React from 'react';
import { AccountDialogProvider } from './AccountDialogProvider';
import AccountDialogForm from './AccountDialogForm';

/**
 * Account dialog content.
 */
export default function AccountDialogContent({ dialogName, payload }) {
  return (
    <AccountDialogProvider dialogName={dialogName} payload={payload}>
      <AccountDialogForm />
    </AccountDialogProvider>
  );
}

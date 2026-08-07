import React from 'react';
import { AccountDialogForm } from './AccountDialogForm';
import { AccountDialogProvider } from './AccountDialogProvider';
import type { AccountDialogPayload } from './types';

interface AccountDialogContentProps {
  dialogName: string;
  payload: AccountDialogPayload;
}

/**
 * Account dialog content.
 */
export function AccountDialogContent({
  dialogName,
  payload,
}: AccountDialogContentProps): React.ReactElement {
  return (
    <AccountDialogProvider dialogName={dialogName} payload={payload}>
      <AccountDialogForm />
    </AccountDialogProvider>
  );
}

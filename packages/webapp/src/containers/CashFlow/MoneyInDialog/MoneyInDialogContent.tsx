import React from 'react';
import { MoneyInDialogProvider } from './MoneyInDialogProvider';
import { MoneyInForm } from './MoneyInForm';

interface MoneyInDialogContentProps {
  dialogName?: string;
  accountId?: number | null;
  accountType?: string | null;
}

/**
 * Money in dialog content.
 */
export function MoneyInDialogContent({
  dialogName,
  accountId,
  accountType,
}: MoneyInDialogContentProps) {
  return (
    <MoneyInDialogProvider
      accountId={accountId}
      accountType={accountType}
      dialogName={dialogName}
    >
      <MoneyInForm />
    </MoneyInDialogProvider>
  );
}

import React from 'react';
import { MoneyOutProvider } from './MoneyOutDialogProvider';
import { MoneyOutForm } from './MoneyOutForm';

interface MoneyOutDialogContentProps {
  dialogName?: string;
  accountId?: number | null;
  accountType?: string | null;
}

/**
 * Money out dailog content.
 */
export function MoneyOutDialogContent({
  dialogName,
  accountId,
  accountType,
}: MoneyOutDialogContentProps) {
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

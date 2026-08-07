import React from 'react';
import '@/style/pages/BadDebt/BadDebtDialog.scss';
import { BadDebtForm } from './BadDebtForm';
import { BadDebtFormProvider } from './BadDebtFormProvider';

interface BadDebtDialogContentProps {
  dialogName: string;
  invoice?: number | null;
}

/**
 * Bad debt  dialog content.
 */
export function BadDebtDialogContent({
  // #ownProps
  dialogName,
  invoice,
}: BadDebtDialogContentProps): React.ReactElement {
  return (
    <BadDebtFormProvider invoiceId={invoice} dialogName={dialogName}>
      <BadDebtForm />
    </BadDebtFormProvider>
  );
}

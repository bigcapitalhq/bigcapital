// @ts-nocheck
import React from 'react';

import '@/style/pages/BadDebt/BadDebtDialog.scss';
import { BadDebtFormProvider } from './BadDebtFormProvider';
import BadDebtForm from './BadDebtForm';

/**
 * Bad debt  dialog content.
 */
export default function BadDebtDialogContent({
  // #ownProps
  dialogName,
  invoice,
}) {
  return (
    <BadDebtFormProvider invoiceId={invoice} dialogName={dialogName}>
      <BadDebtForm />
    </BadDebtFormProvider>
  );
}

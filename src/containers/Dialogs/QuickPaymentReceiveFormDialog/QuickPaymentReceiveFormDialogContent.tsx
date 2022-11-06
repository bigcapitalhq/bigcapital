// @ts-nocheck
import React from 'react';

import '@/style/pages/PaymentReceive/QuickPaymentReceiveDialog.scss';

import { QuickPaymentReceiveFormProvider } from './QuickPaymentReceiveFormProvider';
import QuickPaymentReceiveForm from './QuickPaymentReceiveForm';

/**
 * Quick payment receive form dialog content.
 */
export default function QuickPaymentReceiveFormDialogContent({
  // #ownProps
  dialogName,
  invoice,
}) {
  return (
    <QuickPaymentReceiveFormProvider
      invoiceId={invoice}
      dialogName={dialogName}
    >
      <QuickPaymentReceiveForm />
    </QuickPaymentReceiveFormProvider>
  );
}

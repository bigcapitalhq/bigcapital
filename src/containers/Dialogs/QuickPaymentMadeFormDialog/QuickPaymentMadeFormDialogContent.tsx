// @ts-nocheck
import React from 'react';

import '@/style/pages/PaymentReceive/QuickPaymentReceiveDialog.scss';

import { QuickPaymentMadeFormProvider } from './QuickPaymentMadeFormProvider';
import QuickPaymentMadeForm from './QuickPaymentMadeForm';

/**
 * Quick payment made form dialog content.
 */
export default function QuickPaymentMadeFormDialogContent({
  // #ownProps
  dialogName,
  bill,
}) {
  return (
    <QuickPaymentMadeFormProvider billId={bill} dialogName={dialogName}>
      <QuickPaymentMadeForm />
    </QuickPaymentMadeFormProvider>
  );
}

import React from 'react';
import '@/style/pages/PaymentReceive/QuickPaymentReceiveDialog.scss';
import { QuickPaymentMadeForm } from './QuickPaymentMadeForm';
import { QuickPaymentMadeFormProvider } from './QuickPaymentMadeFormProvider';

interface QuickPaymentMadeFormDialogContentProps {
  dialogName: string;
  bill?: number | null;
}

/**
 * Quick payment made form dialog content.
 */
export function QuickPaymentMadeFormDialogContent({
  // #ownProps
  dialogName,
  bill,
}: QuickPaymentMadeFormDialogContentProps): React.ReactElement {
  return (
    <QuickPaymentMadeFormProvider billId={bill} dialogName={dialogName}>
      <QuickPaymentMadeForm />
    </QuickPaymentMadeFormProvider>
  );
}

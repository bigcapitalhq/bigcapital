import React from 'react';
import '@/style/pages/PaymentReceive/QuickPaymentReceiveDialog.scss';
import { QuickPaymentReceiveForm } from './QuickPaymentReceiveForm';
import { QuickPaymentReceiveFormProvider } from './QuickPaymentReceiveFormProvider';

interface QuickPaymentReceiveFormDialogContentProps {
  dialogName: string;
  invoice?: number | null;
}

/**
 * Quick payment receive form dialog content.
 */
export function QuickPaymentReceiveFormDialogContent({
  // #ownProps
  dialogName,
  invoice,
}: QuickPaymentReceiveFormDialogContentProps): React.ReactElement {
  return (
    <QuickPaymentReceiveFormProvider
      invoiceId={invoice}
      dialogName={dialogName}
    >
      <QuickPaymentReceiveForm />
    </QuickPaymentReceiveFormProvider>
  );
}

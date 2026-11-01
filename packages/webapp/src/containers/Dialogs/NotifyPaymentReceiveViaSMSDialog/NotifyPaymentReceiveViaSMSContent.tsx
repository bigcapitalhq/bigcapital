import React from 'react';
import { NotifyPaymentReceiveViaFormProvider } from './NotifyPaymentReceiveViaFormProvider';
import { NotifyPaymentReceiveViaSMSForm } from './NotifyPaymentReceiveViaSMSForm';

interface NotifyPaymentReceiveViaSMSContentProps {
  dialogName: string;
  paymentReceive?: number | null;
}

export function NotifyPaymentReceiveViaSMSContent({
  dialogName,
  paymentReceive,
}: NotifyPaymentReceiveViaSMSContentProps): React.ReactElement {
  return (
    <NotifyPaymentReceiveViaFormProvider
      paymentReceiveId={paymentReceive}
      dialogName={dialogName}
    >
      <NotifyPaymentReceiveViaSMSForm />
    </NotifyPaymentReceiveViaFormProvider>
  );
}

import React from 'react';
import { NotifyReceiptViaSMSForm } from './NotifyReceiptViaSMSForm';
import { NotifyReceiptViaSMSFormProvider } from './NotifyReceiptViaSMSFormProvider';

interface NotifyReceiptViaSMSDialogContentProps {
  dialogName: string;
  receipt?: number | null;
}

export function NotifyReceiptViaSMSDialogContent({
  dialogName,
  receipt,
}: NotifyReceiptViaSMSDialogContentProps): React.ReactElement {
  return (
    <NotifyReceiptViaSMSFormProvider
      receiptId={receipt}
      dialogName={dialogName}
    >
      <NotifyReceiptViaSMSForm />
    </NotifyReceiptViaSMSFormProvider>
  );
}

import React from 'react';
import { NotifyInvoiceViaSMSForm } from './NotifyInvoiceViaSMSForm';
import { NotifyInvoiceViaSMSFormProvider } from './NotifyInvoiceViaSMSFormProvider';

interface NotifyInvoiceViaSMSDialogContentProps {
  dialogName: string;
  invoiceId?: number | null;
}

export function NotifyInvoiceViaSMSDialogContent({
  dialogName,
  invoiceId,
}: NotifyInvoiceViaSMSDialogContentProps): React.ReactElement {
  return (
    <NotifyInvoiceViaSMSFormProvider
      invoiceId={invoiceId}
      dialogName={dialogName}
    >
      <NotifyInvoiceViaSMSForm />
    </NotifyInvoiceViaSMSFormProvider>
  );
}

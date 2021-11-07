import React from 'react';

import { NotifyInvoiceViaSMSFormProvider } from './NotifyInvoiceViaSMSFormProvider';
import NotifyInvoiceViaSMSForm from './NotifyInvoiceViaSMSForm';

export default function NotifyInvoiceViaSMSDialogContent({
  // #ownProps
  dialogName,
  invoice,
}) {
  return (
    <NotifyInvoiceViaSMSFormProvider
      invoiceId={invoice}
      dialogName={dialogName}
    >
      <NotifyInvoiceViaSMSForm />
    </NotifyInvoiceViaSMSFormProvider>
  );
}

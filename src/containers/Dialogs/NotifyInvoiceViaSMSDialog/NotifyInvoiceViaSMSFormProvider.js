import React from 'react';
import { DialogContent } from 'components';
import { useCreateNotifyInvoiceBySMS, useInvocieSMSDetails } from 'hooks/query';

const NotifyInvoiceViaSMSContext = React.createContext();

function NotifyInvoiceViaSMSFormProvider({ invoiceId, dialogName, ...props }) {
  const { data: invoiceSMSDetail, isLoading: isInvoiceSMSDetailLoading } =
    useInvocieSMSDetails(invoiceId, {
      enabled: !!invoiceId,
    });

  // Create notfiy invoice by sms mutations.
  const { mutateAsync: createNotifyInvoiceBySMSMutate } =
    useCreateNotifyInvoiceBySMS();

  // State provider.
  const provider = {
    invoiceId,
    invoiceSMSDetail,
    dialogName,
    createNotifyInvoiceBySMSMutate,
  };

  return (
    <DialogContent isLoading={isInvoiceSMSDetailLoading}>
      <NotifyInvoiceViaSMSContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useNotifyInvoiceViaSMSContext = () =>
  React.useContext(NotifyInvoiceViaSMSContext);

export { NotifyInvoiceViaSMSFormProvider, useNotifyInvoiceViaSMSContext };

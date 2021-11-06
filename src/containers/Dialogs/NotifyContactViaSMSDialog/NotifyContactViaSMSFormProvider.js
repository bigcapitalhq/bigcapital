import React from 'react';
import { DialogContent } from 'components';
import {
  useInvoice,
  useCreateNotifyInvoiceBySMS,
  useInvocieSMSDetails,
} from 'hooks/query';

const NotifyContactViaSMSContext = React.createContext();

/**
 * Notify contact via SMS provider.
 */
function NotifyContactViaSMSFormProvider({ invoiceId, dialogName, ...props }) {
  // Handle fetch invoice data.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

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
    <DialogContent isLoading={isInvoiceLoading || isInvoiceSMSDetailLoading}>
      <NotifyContactViaSMSContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useNotifyContactViaSMSContext = () =>
  React.useContext(NotifyContactViaSMSContext);

export { NotifyContactViaSMSFormProvider, useNotifyContactViaSMSContext };

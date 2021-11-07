import React from 'react';
import { DialogContent } from 'components';
// import { useCreateNotifyInvoiceBySMS, useInvocieSMSDetails } from 'hooks/query';

const NotifyPaymentReceiveViaSMSContext = React.createContext();

function NotifyPaymentReceiveViaFormProvider({
  paymentReceiveId,
  dialogName,
  ...props
}) {
  // State provider.
  const provider = {
    paymentReceiveId,
    dialogName,
  };

  return (
    <DialogContent
    // isLoading={}
    >
      <NotifyPaymentReceiveViaSMSContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useNotifyPaymentReceiveViaSMSContext = () =>
  React.useContext(NotifyPaymentReceiveViaSMSContext);

export {
  NotifyPaymentReceiveViaFormProvider,
  useNotifyPaymentReceiveViaSMSContext,
};

import React from 'react';
import { DialogContent } from 'components';
// import { useCreateNotifyInvoiceBySMS, useInvocieSMSDetails } from 'hooks/query';

const NotifyReceiptViaSMSContext = React.createContext();

function NotifyReceiptViaSMSFormProvider({ receiptId, dialogName, ...props }) {
  // Create notfiy receipt via sms mutations.

  // State provider.
  const provider = {
    receiptId,
    dialogName,
  };

  return (
    <DialogContent
    // isLoading={}
    >
      <NotifyReceiptViaSMSContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useNotifyReceiptViaSMSContext = () =>
  React.useContext(NotifyReceiptViaSMSContext);

export { NotifyReceiptViaSMSFormProvider, useNotifyReceiptViaSMSContext };

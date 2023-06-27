// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { useCreateNotifyReceiptBySMS, useReceiptSMSDetail } from '@/hooks/query';

const NotifyReceiptViaSMSContext = React.createContext();

/**
 * 
 */
function NotifyReceiptViaSMSFormProvider({ receiptId, dialogName, ...props }) {
  // Create notify receipt via SMS mutations.
  const { mutateAsync: createNotifyReceiptBySMSMutate } =
    useCreateNotifyReceiptBySMS();

  // Retrieve the receipt SMS notification details.
  const { data: receiptSMSDetail, isLoading: isReceiptSMSDetailLoading } =
    useReceiptSMSDetail(receiptId, {
      enabled: !!receiptId,
    });

  // State provider.
  const provider = {
    receiptId,
    dialogName,
    receiptSMSDetail,
    createNotifyReceiptBySMSMutate,
  };

  return (
    <DialogContent isLoading={isReceiptSMSDetailLoading}>
      <NotifyReceiptViaSMSContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useNotifyReceiptViaSMSContext = () =>
  React.useContext(NotifyReceiptViaSMSContext);

export { NotifyReceiptViaSMSFormProvider, useNotifyReceiptViaSMSContext };

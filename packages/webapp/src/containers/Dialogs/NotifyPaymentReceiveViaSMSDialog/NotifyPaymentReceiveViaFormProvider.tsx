// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import {
  useCreateNotifyPaymentReceiveBySMS,
  usePaymentReceiveSMSDetail,
} from '@/hooks/query';

const NotifyPaymentReceiveViaSMSContext = React.createContext();

function NotifyPaymentReceiveViaFormProvider({
  paymentReceiveId,
  dialogName,
  ...props
}) {
  // Create notify receipt via sms mutations.
  const { mutateAsync: createNotifyPaymentReceivetBySMSMutate } =
    useCreateNotifyPaymentReceiveBySMS();

  const {
    data: paymentReceiveMSDetail,
    isLoading: isPaymentReceiveSMSDetailLoading,
  } = usePaymentReceiveSMSDetail(paymentReceiveId, {
    enabled: !!paymentReceiveId,
  });

  // State provider.
  const provider = {
    paymentReceiveId,
    dialogName,
    paymentReceiveMSDetail,
    createNotifyPaymentReceivetBySMSMutate,
  };

  return (
    <DialogContent isLoading={isPaymentReceiveSMSDetailLoading}>
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

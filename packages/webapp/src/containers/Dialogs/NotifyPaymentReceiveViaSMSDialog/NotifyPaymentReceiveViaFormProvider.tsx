import React, { createContext } from 'react';
import type { PaymentReceiveSmsDetailsResponse } from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import {
  useCreateNotifyPaymentReceiveBySMS,
  usePaymentReceiveSMSDetail,
} from '@/hooks/query';

interface NotifyPaymentReceiveViaSMSContextValue {
  paymentReceiveId: number | null;
  dialogName: string;
  paymentReceiveMSDetail: Partial<PaymentReceiveSmsDetailsResponse>;
  createNotifyPaymentReceivetBySMSMutate: ReturnType<
    typeof useCreateNotifyPaymentReceiveBySMS
  >['mutateAsync'];
}

const NotifyPaymentReceiveViaSMSContext =
  createContext<NotifyPaymentReceiveViaSMSContextValue>(
    {} as NotifyPaymentReceiveViaSMSContextValue,
  );

interface NotifyPaymentReceiveViaFormProviderProps {
  paymentReceiveId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

function NotifyPaymentReceiveViaFormProvider({
  paymentReceiveId,
  dialogName,
  ...props
}: NotifyPaymentReceiveViaFormProviderProps) {
  // Create notfiy receipt via sms mutations.
  const { mutateAsync: createNotifyPaymentReceivetBySMSMutate } =
    useCreateNotifyPaymentReceiveBySMS();

  const {
    data: paymentReceiveMSDetailRaw,
    isLoading: isPaymentReceiveSMSDetailLoading,
  } = usePaymentReceiveSMSDetail(paymentReceiveId as number, {
    enabled: !!paymentReceiveId,
  });
  const paymentReceiveMSDetail = paymentReceiveMSDetailRaw ?? {};

  // State provider.
  const provider: NotifyPaymentReceiveViaSMSContextValue = {
    paymentReceiveId: paymentReceiveId ?? null,
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

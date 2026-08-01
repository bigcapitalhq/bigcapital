import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import {
  useCreateNotifyPaymentReceiveBySMS,
  usePaymentReceiveSMSDetail,
} from '@/hooks/query';

interface NotifyPaymentReceiveViaSMSContextValue {
  paymentReceiveId: number | null;
  dialogName: string;
  paymentReceiveMSDetail: Record<string, unknown>;
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
  const paymentReceiveMSDetail =
    (paymentReceiveMSDetailRaw as Record<string, unknown> | undefined) ?? {};

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

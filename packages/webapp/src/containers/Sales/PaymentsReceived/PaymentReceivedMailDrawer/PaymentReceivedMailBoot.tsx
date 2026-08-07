import { Spinner } from '@blueprintjs/core';
import React, { createContext, useContext } from 'react';
import type { PaymentReceiveMailStateResponse } from '@bigcapital/sdk-ts';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { usePaymentReceivedMailState } from '@/hooks/query';

interface PaymentReceivedSendMailBootValues {
  paymentReceivedId: number;

  paymentReceivedMailState: PaymentReceiveMailStateResponse | undefined;
  isPaymentReceivedStateLoading: boolean;
}
interface InvoiceSendMailBootProps {
  children: React.ReactNode;
}

const PaymentReceivedSendMailBootContext =
  createContext<PaymentReceivedSendMailBootValues>(
    {} as PaymentReceivedSendMailBootValues,
  );

export const PaymentReceivedSendMailBoot = ({
  children,
}: InvoiceSendMailBootProps) => {
  const {
    payload: { paymentReceivedId },
  } = useDrawerContext();

  const {
    data: paymentReceivedMailState,
    isLoading: isPaymentReceivedStateLoading,
  } = usePaymentReceivedMailState(paymentReceivedId);

  const isLoading = isPaymentReceivedStateLoading;

  if (isLoading) {
    return <Spinner size={20} />;
  }
  const value = {
    paymentReceivedId,

    // # mail options
    isPaymentReceivedStateLoading,
    paymentReceivedMailState,
  };

  return (
    <PaymentReceivedSendMailBootContext.Provider value={value}>
      {children}
    </PaymentReceivedSendMailBootContext.Provider>
  );
};
PaymentReceivedSendMailBoot.displayName = 'PaymentReceivedSendMailBoot';

export const usePaymentReceivedSendMailBoot = () => {
  return useContext<PaymentReceivedSendMailBootValues>(
    PaymentReceivedSendMailBootContext,
  );
};

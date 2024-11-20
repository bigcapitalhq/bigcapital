import React, { createContext, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';
import {
  PaymentReceivedStateResponse,
  usePaymentReceivedState,
} from '@/hooks/query';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

interface PaymentReceivedSendMailBootValues {
  paymentReceivedId: number;

  paymentReceivedMailState: PaymentReceivedStateResponse | undefined;
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
  } = usePaymentReceivedState(paymentReceivedId);

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

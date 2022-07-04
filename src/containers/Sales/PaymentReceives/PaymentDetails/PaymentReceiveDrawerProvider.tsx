import React, { createContext, useContext } from 'react';
import { usePaymentReceive } from 'hooks/query';
import { DrawerHeaderContent, DashboardInsider } from '@/components';

const PaymentReceiveDrawerContext = createContext();

function PaymentReceiveDrawerProvider({ paymentReceiveId, ...props }) {
  const {
    data: paymentReceive,
    isFetching: isPaymentReceiveLoading,
  } = usePaymentReceive(paymentReceiveId, {
    enabled: !!paymentReceiveId,
  });

  // Provider payload.
  const provider = {
    paymentReceiveId,
    paymentReceive,
  };

  return (
    <DashboardInsider loading={isPaymentReceiveLoading}>
      <DrawerHeaderContent name={'payment-receive-drawer'} />
      <PaymentReceiveDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}
const usePaymentReceiveDrawerContext = () =>
  useContext(PaymentReceiveDrawerContext);

export { PaymentReceiveDrawerProvider, usePaymentReceiveDrawerContext };

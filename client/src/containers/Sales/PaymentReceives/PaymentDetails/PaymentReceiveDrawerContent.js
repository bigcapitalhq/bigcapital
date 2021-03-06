import React from 'react';
import { PaymentReceiveDrawerProvider } from './PaymentReceiveDrawerProvider';
import PaymentReceivePaper from './PaymentReceivePaper';
/**
 *  payment receive drawer content.
 */
export default function PaymentReceiveDrawerContent({
  // #ownProp
  paymentReceiveId,
}) {
  
  return (
    <PaymentReceiveDrawerProvider paymentReceiveId={paymentReceiveId}>
      <PaymentReceivePaper />
    </PaymentReceiveDrawerProvider>
  );
}

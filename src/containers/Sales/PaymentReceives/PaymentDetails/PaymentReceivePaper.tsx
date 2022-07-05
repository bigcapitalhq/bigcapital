import React from 'react';
import PaymentPaperTemplate from '@/containers/Drawers/PaymentPaperTemplate/PaymentPaperTemplate';
import { usePaymentReceiveDrawerContext } from './PaymentReceiveDrawerProvider';

export default function PaymentReceivePaper() {
  const { paymentReceive } = usePaymentReceiveDrawerContext();

  return <PaymentPaperTemplate paperData={paymentReceive} />;
}

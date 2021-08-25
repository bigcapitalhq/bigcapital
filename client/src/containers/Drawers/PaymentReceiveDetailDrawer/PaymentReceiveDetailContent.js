import React from 'react';

import PaymentReceiveDetail from './PaymentReceiveDetail';
import { PaymentReceiveDetailProvider } from './PaymentReceiveDetailProvider';

/**
 * Payment receive detail content.
 */
export default function PaymentReceiveDetailContent({
  // #ownProp
  paymentReceiveId,
}) {
  return (
    <PaymentReceiveDetailProvider paymentReceiveId={paymentReceiveId}>
      <PaymentReceiveDetail />
    </PaymentReceiveDetailProvider>
  );
}

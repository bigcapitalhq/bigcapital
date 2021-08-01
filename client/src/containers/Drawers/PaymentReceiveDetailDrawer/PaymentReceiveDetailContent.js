import React from 'react';


import 'style/components/Drawers/ViewDetail/ViewDetail.scss';

import PaymentReceiveDetail from './PaymentReceiveDetail';
import { PaymentReceiveDetailProvider } from './PaymentReceiveDetailProvider';

/**
 * Payment receive detail content.
 */
export default function PaymentReceiveDetailContent({
  // #ownProp
  paymentReceive,
}) {
  return (
    <PaymentReceiveDetailProvider paymentReceiveId={paymentReceive}>
      <PaymentReceiveDetail />
    </PaymentReceiveDetailProvider>
  );
}

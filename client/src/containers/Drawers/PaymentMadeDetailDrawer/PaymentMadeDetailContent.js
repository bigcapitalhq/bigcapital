import React from 'react';

import 'style/components/Drawers/ViewDetail/ViewDetail.scss';

import PaymentMadeDetails from './PaymentMadeDetails';
import { PaymentMadeDetailProvider } from './PaymentMadeDetailProvider';

/**
 * Payment made detail content.
 */
export default function PaymentMadeDetailContent({
  // #ownProp
  paymentMade,
}) {
  return (
    <PaymentMadeDetailProvider paymentMadeId={paymentMade}>
      <PaymentMadeDetails />
    </PaymentMadeDetailProvider>
  );
}

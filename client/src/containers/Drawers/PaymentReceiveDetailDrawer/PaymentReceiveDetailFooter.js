import React from 'react';

import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

export default function PaymentReceiveDetailFooter() {
  const {
    paymentReceive: { formatted_amount },
  } = usePaymentReceiveDetailContext();

  return (
    <div className="payment-drawer__content-footer">
      <div class="total-lines">
        <div class="total-lines__line total-lines__line--subtotal">
          <div class="title">Subtotal</div>
          <div class="amount">{formatted_amount}</div>
        </div>
        <div class="total-lines__line total-lines__line--total">
          <div class="title">TOTAL</div>
          <div class="amount">{'Amount'}</div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

export default function PaymentMadeDetailFooter() {
  const {
    paymentEntries: { total_payment_amount },
  } = usePaymentMadeDetailContext();

  return (
    <div className="payment-drawer__content-footer">
      <div class="total-lines">
        <div class="total-lines__line total-lines__line--subtotal">
          <div class="title">Subtotal</div>
          <div class="amount">{total_payment_amount}</div>
        </div>
        <div class="total-lines__line total-lines__line--total">
          <div class="title">TOTAL</div>
          <div class="amount">{total_payment_amount}</div>
        </div>
      </div>
    </div>
  );
}

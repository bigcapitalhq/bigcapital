// @ts-nocheck
import React from 'react';
import PaymentViaVoucherDialog from '@/containers/Dialogs/PaymentViaVoucherDialog';

/**
 * Setup dialogs.
 */
export default function SetupDialogs() {
  return (
    <div class="setup-dialogs">
      <PaymentViaVoucherDialog dialogName={'payment-via-voucher'} />
    </div>
  )
}
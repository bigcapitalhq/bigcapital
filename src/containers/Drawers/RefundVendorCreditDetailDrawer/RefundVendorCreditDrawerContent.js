import React from 'react';
import { DrawerBody } from 'components';

import RefundVendorCreditDetail from './RefundVendorCreditDetail';
import { RefundVendorCreditDrawerProvider } from './RefundVendorCreditDrawerProvider';

/**
 * Refund vendor credit drawer content.
 * @returns
 */
export default function RefundVendorCreditDrawerContent({
  refundTransactionId,
}) {
  return (
    <RefundVendorCreditDrawerProvider refundTransactionId={refundTransactionId}>
      <DrawerBody>
        <RefundVendorCreditDetail />
      </DrawerBody>
    </RefundVendorCreditDrawerProvider>
  );
}

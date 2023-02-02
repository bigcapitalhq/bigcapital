// @ts-nocheck
import React from 'react';

import { DrawerBody } from '@/components';
import { RefundVendorCreditDrawerProvider } from './RefundVendorCreditDrawerProvider';
import RefundVendorCreditDetail from './RefundVendorCreditDetail';

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

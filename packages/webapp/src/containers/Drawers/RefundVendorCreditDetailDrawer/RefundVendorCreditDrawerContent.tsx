// @ts-nocheck
import React from 'react';
import { RefundVendorCreditDetail } from './RefundVendorCreditDetail';
import { RefundVendorCreditDrawerProvider } from './RefundVendorCreditDrawerProvider';
import { DrawerBody } from '@/components';

/**
 * Refund vendor credit drawer content.
 * @returns
 */
export function RefundVendorCreditDrawerContent({ refundTransactionId }) {
  return (
    <RefundVendorCreditDrawerProvider refundTransactionId={refundTransactionId}>
      <DrawerBody>
        <RefundVendorCreditDetail />
      </DrawerBody>
    </RefundVendorCreditDrawerProvider>
  );
}

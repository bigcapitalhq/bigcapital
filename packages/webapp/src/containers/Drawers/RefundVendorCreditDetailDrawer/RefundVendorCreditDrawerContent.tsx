import React from 'react';
import { RefundVendorCreditDetail } from './RefundVendorCreditDetail';
import { RefundVendorCreditDrawerProvider } from './RefundVendorCreditDrawerProvider';
import { DrawerBody } from '@/components';

interface RefundVendorCreditDrawerContentProps {
  refundTransactionId?: number | null;
}

/**
 * Refund vendor credit drawer content.
 */
export function RefundVendorCreditDrawerContent({
  refundTransactionId,
}: RefundVendorCreditDrawerContentProps) {
  return (
    <RefundVendorCreditDrawerProvider refundTransactionId={refundTransactionId}>
      <DrawerBody>
        <RefundVendorCreditDetail />
      </DrawerBody>
    </RefundVendorCreditDrawerProvider>
  );
}

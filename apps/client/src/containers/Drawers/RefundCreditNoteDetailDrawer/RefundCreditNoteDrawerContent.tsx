// @ts-nocheck
import React from 'react';

import { DrawerBody } from '@/components';
import { RefundCreditNoteDrawerProvider } from './RefundCreditNoteDrawerProvider';
import RefundCreditNoteDetail from './RefundCreditNoteDetail';

/**
 * Refund credit note drawer content.
 */
export default function RefundCreditNoteDrawerContent({ refundTransactionId }) {
  return (
    <RefundCreditNoteDrawerProvider refundTransactionId={refundTransactionId}>
      <DrawerBody>
        <RefundCreditNoteDetail />
      </DrawerBody>
    </RefundCreditNoteDrawerProvider>
  );
}

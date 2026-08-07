// @ts-nocheck
import React from 'react';
import { RefundCreditNoteDetail } from './RefundCreditNoteDetail';
import { RefundCreditNoteDrawerProvider } from './RefundCreditNoteDrawerProvider';
import { DrawerBody } from '@/components';

/**
 * Refund credit note drawer content.
 */
export function RefundCreditNoteDrawerContent({ refundTransactionId }) {
  return (
    <RefundCreditNoteDrawerProvider refundTransactionId={refundTransactionId}>
      <DrawerBody>
        <RefundCreditNoteDetail />
      </DrawerBody>
    </RefundCreditNoteDrawerProvider>
  );
}

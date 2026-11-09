import React from 'react';
import { RefundCreditNoteDetail } from './RefundCreditNoteDetail';
import { RefundCreditNoteDrawerProvider } from './RefundCreditNoteDrawerProvider';
import { DrawerBody } from '@/components';

interface RefundCreditNoteDrawerContentProps {
  refundTransactionId?: number | null;
}

/**
 * Refund credit note drawer content.
 */
export function RefundCreditNoteDrawerContent({
  refundTransactionId,
}: RefundCreditNoteDrawerContentProps) {
  return (
    <RefundCreditNoteDrawerProvider refundTransactionId={refundTransactionId}>
      <DrawerBody>
        <RefundCreditNoteDetail />
      </DrawerBody>
    </RefundCreditNoteDrawerProvider>
  );
}

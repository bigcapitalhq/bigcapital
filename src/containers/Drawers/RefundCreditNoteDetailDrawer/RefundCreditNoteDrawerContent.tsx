import React from 'react';
import { DrawerBody } from 'components';

import RefundCreditNoteDetail from './RefundCreditNoteDetail';
import { RefundCreditNoteDrawerProvider } from './RefundCreditNoteDrawerProvider';

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

import React from 'react';
import { ReceiptDrawerProvider } from './ReceiptDrawerProvider';
import ReceiptPaper from './ReceiptPaper';

/**
 *  Receipt drawer content.
 */
export default function ReceiptDrawerContent({
  // #ownProp
  receiptId,
}) {
  return (
    <ReceiptDrawerProvider receiptId={receiptId}>
      <ReceiptPaper />
    </ReceiptDrawerProvider>
  );
}

import React from 'react';
import { ReceiptDetail } from './ReceiptDetail';
import { ReceiptDetailDrawerProvider } from './ReceiptDetailDrawerProvider';
import { DrawerBody } from '@/components';

interface ReceiptDetailDrawerContentProps {
  receiptId: number | undefined;
}

/**
 * Receipt detail drawer content.
 */
export function ReceiptDetailDrawerContent({
  // #ownProp
  receiptId,
}: ReceiptDetailDrawerContentProps) {
  return (
    <ReceiptDetailDrawerProvider receiptId={receiptId}>
      <DrawerBody>
        <ReceiptDetail />
      </DrawerBody>
    </ReceiptDetailDrawerProvider>
  );
}

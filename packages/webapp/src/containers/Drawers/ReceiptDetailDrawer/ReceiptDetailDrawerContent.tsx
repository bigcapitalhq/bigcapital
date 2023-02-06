// @ts-nocheck
import React from 'react';
import { DrawerBody } from '@/components';

import ReceiptDetail from './ReceiptDetail';
import { ReceiptDetailDrawerProvider } from './ReceiptDetailDrawerProvider';

/**
 * Receipt detail drawer content.
 */
export default function ReceiptDetailDrawerContent({
  // #ownProp
  receiptId,
}) {
  return (
    <ReceiptDetailDrawerProvider receiptId={receiptId}>
      <DrawerBody>
        <ReceiptDetail />
      </DrawerBody>
    </ReceiptDetailDrawerProvider>
  );
}

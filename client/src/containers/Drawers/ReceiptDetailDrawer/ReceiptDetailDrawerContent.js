import React from 'react';

import 'style/components/Drawers/ViewDetail/ViewDetail.scss';

import ReceiptDetail from './ReceiptDetail';
import { ReceiptDetailDrawerProvider } from './ReceiptDetailDrawerProvider';

/**
 * Receipt detail drawer content.
 */
export default function ReceiptDetailDrawerContent({
  // #ownProp
  receipt,
}) {
  return (
    <ReceiptDetailDrawerProvider receiptId={receipt}>
      <ReceiptDetail />
    </ReceiptDetailDrawerProvider>
  );
}

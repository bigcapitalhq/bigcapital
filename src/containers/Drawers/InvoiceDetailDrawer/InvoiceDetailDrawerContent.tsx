// @ts-nocheck
import React from 'react';
import { DrawerBody } from '@/components';

import InvoiceDetail from './InvoiceDetail';
import { InvoiceDetailDrawerProvider } from './InvoiceDetailDrawerProvider';

/**
 * Invoice detail drawer content.
 * @returns {React.JSX}
 */
export default function InvoiceDetailDrawerContent({
  // #ownProp
  invoiceId,
}) {
  return (
    <InvoiceDetailDrawerProvider invoiceId={invoiceId}>
      <DrawerBody>
        <InvoiceDetail />
      </DrawerBody>
    </InvoiceDetailDrawerProvider>
  );
}

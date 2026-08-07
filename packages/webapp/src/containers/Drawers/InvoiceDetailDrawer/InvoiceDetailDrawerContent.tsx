import React from 'react';
import { InvoiceDetail } from './InvoiceDetail';
import { InvoiceDetailDrawerProvider } from './InvoiceDetailDrawerProvider';
import { DrawerBody } from '@/components';

interface InvoiceDetailDrawerContentProps {
  invoiceId: number | undefined;
}

/**
 * Invoice detail drawer content.
 * @returns {React.JSX}
 */
export function InvoiceDetailDrawerContent({
  // #ownProp
  invoiceId,
}: InvoiceDetailDrawerContentProps) {
  return (
    <InvoiceDetailDrawerProvider invoiceId={invoiceId}>
      <DrawerBody>
        <InvoiceDetail />
      </DrawerBody>
    </InvoiceDetailDrawerProvider>
  );
}

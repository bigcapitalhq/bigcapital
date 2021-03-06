import React from 'react';
import { InvoiceDrawerProvider } from './InvoiceDrawerProvider';
import InvoicePaper from './InvoicePaper';

/**
 *  Invoice drawer content.
 */
export default function InvoiceDrawerContent({
  // #ownProp
  invoiceId,
}) {

  return (
    <InvoiceDrawerProvider invoiceId={invoiceId}>
      <InvoicePaper />
    </InvoiceDrawerProvider>
  );
}

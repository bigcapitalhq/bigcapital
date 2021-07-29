import React from 'react';

import 'style/components/Drawers/ViewDetail/ViewDetail.scss';

import InvoiceDetail from './InvoiceDetail';
import { InvoiceDetailDrawerProvider } from './InvoiceDetailDrawerProvider';

/**
 * Invoice detail drawer content.
 */
export default function InvoiceDetailDrawerContent({
  // #ownProp
  invoice,
}) {
  return (
    <InvoiceDetailDrawerProvider invoiceId={invoice}>
      <InvoiceDetail />
    </InvoiceDetailDrawerProvider>
  );
}

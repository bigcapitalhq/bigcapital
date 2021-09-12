import React from 'react';
import { DrawerBody } from 'components';

import 'style/components/Drawers/ViewDetail/ViewDetail.scss';

import InvoiceDetail from './InvoiceDetail';
import { InvoiceDetailDrawerProvider } from './InvoiceDetailDrawerProvider';

/**
 * Invoice detail drawer content.
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

import React from 'react';

import { CommercialDocBox } from 'components';

import InvoiceDetailHeader from './InvoiceDetailHeader';
import InvoiceDetailTable from './InvoiceDetailTable';
import { InvoiceDetailFooter } from './InvoiceDetailFooter';

/**
 * Invoice readonly details tab panel.
 */
export default function InvoiceDetailTab() {
  return (
    <CommercialDocBox>
      <InvoiceDetailHeader />
      <InvoiceDetailTable />
      <InvoiceDetailFooter />
    </CommercialDocBox>
  );
}

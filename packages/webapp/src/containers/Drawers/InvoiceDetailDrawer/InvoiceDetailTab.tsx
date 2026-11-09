import React from 'react';
import { InvoiceDetailFooter } from './InvoiceDetailFooter';
import { InvoiceDetailHeader } from './InvoiceDetailHeader';
import { InvoiceDetailTable } from './InvoiceDetailTable';
import { InvoiceDetailTableFooter } from './InvoiceDetailTableFooter';
import { CommercialDocBox } from '@/components';

/**
 * Invoice readonly details tab panel.
 */
export function InvoiceDetailTab() {
  return (
    <CommercialDocBox>
      <InvoiceDetailHeader />
      <InvoiceDetailTable />
      <InvoiceDetailTableFooter />
      <InvoiceDetailFooter />
    </CommercialDocBox>
  );
}

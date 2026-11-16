import React from 'react';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';
import { InvoiceDetailFooter } from './InvoiceDetailFooter';
import { InvoiceDetailHeader } from './InvoiceDetailHeader';
import { InvoiceDetailTable } from './InvoiceDetailTable';
import { InvoiceDetailTableFooter } from './InvoiceDetailTableFooter';
import { CommercialDocBox } from '@/components';
import { BatchMovementsSection } from '@/ee/batches/components';

/**
 * Invoice readonly details tab panel.
 */
export function InvoiceDetailTab() {
  const { invoice } = useInvoiceDetailDrawerContext();

  return (
    <CommercialDocBox>
      <InvoiceDetailHeader />
      <InvoiceDetailTable />
      <InvoiceDetailTableFooter />
      <BatchMovementsSection
        batches={invoice?.batches ?? []}
        direction={'out'}
      />
      <InvoiceDetailFooter />
    </CommercialDocBox>
  );
}

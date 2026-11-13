import React from 'react';
import { RecurringInvoiceDetailFooter } from './RecurringInvoiceDetailFooter';
import { RecurringInvoiceDetailHeader } from './RecurringInvoiceDetailHeader';
import { RecurringInvoiceDetailTable } from './RecurringInvoiceDetailTable';
import { RecurringInvoiceDetailTableFooter } from './RecurringInvoiceDetailTableFooter';
import { CommercialDocBox } from '@/components';

/**
 * Recurring invoice readonly details tab panel.
 */
export function RecurringInvoiceDetailTab() {
  return (
    <CommercialDocBox>
      <RecurringInvoiceDetailHeader />
      <RecurringInvoiceDetailTable />
      <RecurringInvoiceDetailTableFooter />
      <RecurringInvoiceDetailFooter />
    </CommercialDocBox>
  );
}

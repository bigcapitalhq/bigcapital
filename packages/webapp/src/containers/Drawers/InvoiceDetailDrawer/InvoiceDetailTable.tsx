import React from 'react';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';
import { useInvoiceReadonlyEntriesColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Invoice readonly details entries table columns.
 */
export function InvoiceDetailTable() {
  // Invoice readonly entries table columns.
  const columns = useInvoiceReadonlyEntriesColumns();

  // Invoice details drawer context.
  const { invoice } = useInvoiceDetailDrawerContext();
  const entries = invoice?.entries ?? [];

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      styleName={TableStyle.Constrant}
      initialHiddenColumns={
        // If any entry has no discount, hide the discount column.
        entries.some((e) => e.discountFormatted) ? [] : ['discount']
      }
    />
  );
}

import React from 'react';
import { useRecurringInvoiceDetailDrawerContext } from './RecurringInvoiceDetailDrawerProvider';
import { useRecurringInvoiceReadonlyEntriesColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Recurring invoice readonly details entries table.
 */
export function RecurringInvoiceDetailTable() {
  const columns = useRecurringInvoiceReadonlyEntriesColumns();
  const { recurringInvoice } = useRecurringInvoiceDetailDrawerContext();
  const entries = recurringInvoice?.entries ?? [];

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      styleName={TableStyle.Constrant}
      initialHiddenColumns={
        // If any entry has no discount, hide the discount column.
        entries.some((entry) => entry.discountFormatted) ? [] : ['discount']
      }
    />
  );
}

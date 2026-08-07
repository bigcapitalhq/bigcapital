import React from 'react';
import { useBillDrawerContext } from './BillDrawerProvider';
import { useBillReadonlyEntriesTableColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

export function BillDetailTable() {
  const { bill } = useBillDrawerContext();
  const entries = bill?.entries ?? [];

  // Retrieve bill readonly entries table columns.
  const columns = useBillReadonlyEntriesTableColumns();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      initialHiddenColumns={
        // If any entry has no discount, hide the discount column.
        entries?.some((e) => e.discountFormatted) ? [] : ['discount']
      }
      styleName={TableStyle.Constrant}
    />
  );
}

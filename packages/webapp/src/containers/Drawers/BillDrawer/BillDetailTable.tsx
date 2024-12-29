// @ts-nocheck
import React from 'react';

import { CommercialDocEntriesTable } from '@/components';

import { useBillDrawerContext } from './BillDrawerProvider';
import { useBillReadonlyEntriesTableColumns } from './utils';

import { TableStyle } from '@/constants';

export default function BillDetailTable() {
  const {
    bill: { entries },
  } = useBillDrawerContext();

  // Retrieve bill readonly entries table columns.
  const columns = useBillReadonlyEntriesTableColumns();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      initialHiddenColumns={
        // If any entry has no discount, hide the discount column.
        entries?.some((e) => e.discount_formatted) ? [] : ['discount']
      }
      styleName={TableStyle.Constrant}
    />
  );
}

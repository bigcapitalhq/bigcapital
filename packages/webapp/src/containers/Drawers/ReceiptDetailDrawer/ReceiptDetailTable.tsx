// @ts-nocheck
import React from 'react';

import { CommercialDocEntriesTable } from '@/components';

import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';
import { useReceiptReadonlyEntriesTableColumns } from './utils';

import { TableStyle } from '@/constants';

/**
 * Receipt readonly details table columns.
 */
export default function ReceiptDetailTable() {
  // Receipt details drawer context.
  const {
    receipt: { entries },
  } = useReceiptDetailDrawerContext();

  // Receipt readonly entries table columns.
  const columns = useReceiptReadonlyEntriesTableColumns();

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

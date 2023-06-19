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
      styleName={TableStyle.Constraint}
    />
  );
}

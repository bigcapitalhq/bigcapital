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
      styleName={TableStyle.Constraint}
    />
  );
}

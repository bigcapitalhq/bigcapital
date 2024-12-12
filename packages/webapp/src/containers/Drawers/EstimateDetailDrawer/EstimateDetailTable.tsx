// @ts-nocheck
import React from 'react';

import { CommercialDocEntriesTable } from '@/components';

import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';
import { useEstimateReadonlyEntriesColumns } from './utils';

import { TableStyle } from '@/constants';

/**
 * Estimate detail table.
 */
export default function EstimateDetailTable() {
  const {
    estimate: { entries },
  } = useEstimateDetailDrawerContext();

  // Estimate entries table columns.
  const columns = useEstimateReadonlyEntriesColumns();

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

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
      styleName={TableStyle.Constraint}
    />
  );
}

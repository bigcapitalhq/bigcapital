import React from 'react';

import { CommercialDocEntriesTable } from 'components';

import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';
import { useEstimateReadonlyEntriesColumns } from './utils';

import { TableStyle } from '../../../common';

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
      styleName={TableStyle.Constrant}
    />
  );
}

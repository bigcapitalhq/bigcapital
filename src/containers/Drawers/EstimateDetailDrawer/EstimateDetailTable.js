import React from 'react';
import clsx from 'classnames';

import { DataTable } from 'components';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';

import { useEstimateReadonlyEntriesColumns } from './utils';

import EstimateDetailsCls from 'style/components/Drawers/EstimateDetails.module.scss';

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
    <div className={clsx(EstimateDetailsCls.detail_panel_table)}>
      <DataTable
        columns={columns}
        data={entries}
        className={'table-constrant'}
      />
    </div>
  );
}

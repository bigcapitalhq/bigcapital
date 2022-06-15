// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { DataTable, TableFastCell } from 'components';
import TableVirtualizedListRows from 'components/Datatable/TableVirtualizedRows';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import { useTimesheetColumns, ActionsMenu } from './components';
import { TableStyle } from '../../../../../common';
import withSettings from '../../../../Settings/withSettings';

import { compose } from 'utils';

const Timesheet = [
  {
    id: 1,
    data: '2020-01-01',
    task: 'Task 1',
    user: 'User 1',
    time: '12:00Am',
    billingStatus: '',
  },
];

/**
 * Timesheet DataTable.
 * @returns
 */
function TimesheetDataTable({
  // #withSettings
  timesheetsTableSize,
}) {
  // Retrieve timesheet table columns.
  const columns = useTimesheetColumns();

  // Handle delete timesheet.
  const handleDeleteTimesheet = () => {};

  return (
    <TimesheetsTable
      columns={columns}
      data={Timesheet}
      // loading={}
      // headerLoading={}
      noInitialFetch={true}
      sticky={true}
      expandColumnSpace={1}
      expandToggleColumn={2}
      selectionColumnWidth={45}
      ContextMenu={ActionsMenu}
      TableCellRenderer={TableFastCell}
      TableLoadingRenderer={TableSkeletonRows}
      TableRowsRenderer={TableVirtualizedListRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      vListrowHeight={timesheetsTableSize === 'small' ? 32 : 40}
      vListOverscanRowCount={0}
      styleName={TableStyle.Constrant}
      payload={{
        onDelete: handleDeleteTimesheet,
      }}
    />
  );
}

export default compose(
  withSettings(({ timesheetsSettings }) => ({
    timesheetsTableSize: timesheetsSettings?.tableSize,
  })),
)(TimesheetDataTable);

const TimesheetsTable = styled(DataTable)`
  .table .tbody {
    .tbody-inner .tr.no-results {
      .td {
        padding: 2rem 0;
        font-size: 14px;
        color: #888;
        font-weight: 400;
        border-bottom: 0;
      }
    }

    .tbody-inner {
      .tr .td:not(:first-child) {
        border-left: 1px solid #e6e6e6;
      }
    }
  }
`;

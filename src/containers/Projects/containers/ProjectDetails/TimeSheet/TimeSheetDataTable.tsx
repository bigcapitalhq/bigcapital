// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { DataTable, TableFastCell, DashboardContentTable } from 'components';
import TableVirtualizedListRows from 'components/Datatable/TableVirtualizedRows';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import { useTimeSheetColumns, ActionMenu } from './components';
import { TableStyle } from '../../../../../common';
import withSettings from '../../../../Settings/withSettings';

import { compose } from 'utils';

const TimeSheet = [
  {
    id: 1,
    data: '2020-01-01',
    task: 'Task 1',
    user: 'User 1',
    time: '12:00Am',
    billingStatus: '',
  },
  {
    id: 2,
    data: '2021-01-01',
    task: 'Task 2',
    user: 'User 2',
    time: '12:00Am',
    billingStatus: '',
  },
  {
    id: 3,
    data: '2022-01-01',
    task: 'Task 3',
    user: 'User 3',
    time: '12:00Am',
    billingStatus: '',
  },
];

/**
 * TimeSheet DataTable.
 * @returns
 */
function TimeSheetDataTable({
  // #withSettings
  timeSheetsTableSize,
}) {
  // Retrieve timesheet table columns.
  const columns = useTimeSheetColumns();

  return (
    <DashboardContentTable>
      <TimeSheetsTable
        columns={columns}
        data={TimeSheet}
        // loading={}
        // headerLoading={}
        noInitialFetch={true}
        sticky={true}
        expandColumnSpace={1}
        expandToggleColumn={2}
        selectionColumnWidth={45}
        TableCellRenderer={TableFastCell}
        TableLoadingRenderer={TableSkeletonRows}
        TableRowsRenderer={TableVirtualizedListRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        vListrowHeight={timeSheetsTableSize === 'small' ? 32 : 40}
        vListOverscanRowCount={0}
        styleName={TableStyle.Constrant}
        // payload={{}}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withSettings(({ timeSheetsSettings }) => ({
    timeSheetsTableSize: timeSheetsSettings?.tableSize,
  })),
)(TimeSheetDataTable);

const DashboardConstrantTable = styled(DataTable)`
  .table {
    .thead {
      .th {
        background: #fff;
      }
    }

    .tbody {
      .tr:last-child .td {
        border-bottom: 0;
      }
    }
  }
`;

const TimeSheetsTable = styled(DashboardConstrantTable)`
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

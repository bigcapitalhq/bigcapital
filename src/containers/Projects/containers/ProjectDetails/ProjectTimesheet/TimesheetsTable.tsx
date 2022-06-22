// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import { useTimesheetColumns, ActionsMenu } from './components';
import { TABLES } from 'common/tables';
import { useMemorizedColumnsWidths } from 'hooks';
import withSettings from '../../../../Settings/withSettings';

import { compose } from 'utils';

const Timesheet = [
  {
    id: 1,
    date: '2022-06-08T22:00:00.000Z',
    name: 'Lighting',
    display_name: 'Kyrie Rearden',
    description: 'Laid paving stones',
    duration: '12:00',
  },
  {
    id: 2,
    date: '2022-06-08T22:00:00.000Z',
    name: 'Interior Decoration',
    display_name: 'Project Sherwood',
    description: 'Laid paving stones',
    duration: '11:00',
  },
];

/**
 * Timesheet DataTable.
 * @returns
 */
function TimesheetsTable({
  // #withSettings
  timesheetsTableSize,
}) {
  // Retrieve timesheet table columns.
  const columns = useTimesheetColumns();

  // Handle delete timesheet.
  const handleDeleteTimesheet = () => {};

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.TIMESHEETS);

  return (
    <TimesheetDataTable
      columns={columns}
      data={Timesheet}
      // loading={}
      // headerLoading={}
      // progressBarLoading={}
      manualSortBy={true}
      noInitialFetch={true}
      sticky={true}
      hideTableHeader={true}
      ContextMenu={ActionsMenu}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      size={timesheetsTableSize}
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
)(TimesheetsTable);

const TimesheetDataTable = styled(DataTable)`
  .table {
    .thead .tr .th {
      .resizer {
        display: none;
      }
    }

    .tbody {
      .tr .td {
        padding: 0.5rem 0.8rem;
      }

      .avatar.td {
        .avatar {
          display: inline-block;
          background: #adbcc9;
          border-radius: 50%;
          text-align: center;
          font-weight: 400;
          color: #fff;

          &[data-size='medium'] {
            height: 30px;
            width: 30px;
            line-height: 30px;
            font-size: 14px;
          }
          &[data-size='small'] {
            height: 25px;
            width: 25px;
            line-height: 25px;
            font-size: 12px;
          }
        }
      }
    }

    .table-size--small {
      .tbody .tr {
        height: 45px;
      }
    }
  }
`;

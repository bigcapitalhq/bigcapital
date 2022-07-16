import React from 'react';
import styled from 'styled-components';
import {
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { ActionsMenu } from './components';
import { useProjectTimesheetColumns } from './hooks';
import { TABLES } from '@/constants/tables';
import { useMemorizedColumnsWidths } from '@/hooks';
import withSettings from '@/containers/Settings/withSettings';

import { compose } from '@/utils';

/**
 * Timesheet DataTable.
 * @returns
 */
function ProjectTimesheetsTableRoot({
  // #withSettings
  timesheetsTableSize,
}) {
  // Retrieve project timesheet table columns.
  const columns = useProjectTimesheetColumns();

  // Handle delete timesheet.
  const handleDeleteTimesheet = () => {};

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.TIMESHEETS);

  return (
    <ProjectTimesheetDataTable
      columns={columns}
      data={[]}
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
export const ProjectTimesheetsTable = compose(
  withSettings(({ timesheetsSettings }) => ({
    timesheetsTableSize: timesheetsSettings?.tableSize,
  })),
)(ProjectTimesheetsTableRoot);

const ProjectTimesheetDataTable = styled(DataTable)`
  .table {
    .thead .tr .th {
      .resizer {
        display: none;
      }
    }

    .tbody {
      .tr .td {
      }

      .avatar.td {
        .cell-inner {
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
    }
  }
  .table-size--small {
    .tbody .tr {
      height: 45px;
    }
  }
`;

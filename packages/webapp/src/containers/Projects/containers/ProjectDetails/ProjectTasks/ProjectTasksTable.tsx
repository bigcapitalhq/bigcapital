// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import {
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { TABLES } from '@/constants/tables';
import { ActionsMenu } from './components';
import { useProjectTaskColumns } from './hooks';
import { useMemorizedColumnsWidths } from '@/hooks';
import { useProjectTaskContext } from './ProjectTaskProvider';
import withSettings from '@/containers/Settings/withSettings';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose } from '@/utils';

function ProjectTaskTableRoot({
  // #withSettings
  projectTasksTableSize,

  // #withDialog
  openDialog,
  // #withAlertsActions
  openAlert,
}) {
  const { projectTasks } = useProjectTaskContext();

  // Retrieve project task table columns.
  const columns = useProjectTaskColumns();

  // Handle delete task.
  const handleDeleteTask = ({ id }) => {
    openAlert('project-task-delete', { taskId: id });
  };

  const handleEditTask = ({ id }) => {
    openDialog('project-task-form', {
      taskId: id,
      action: 'edit',
    });
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.PROJECT_TASKS);

  return (
    <ProjectTaskDataTable
      columns={columns}
      data={projectTasks}
      manualSortBy={true}
      noInitialFetch={true}
      sticky={true}
      hideTableHeader={true}
      ContextMenu={ActionsMenu}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      size={projectTasksTableSize}
      payload={{
        onDelete: handleDeleteTask,
        onEdit: handleEditTask,
      }}
    />
  );
}

export const ProjectTasksTable = compose(
  withAlertsActions,
  withDialogActions,
  withSettings(({ projectTasksSettings }) => ({
    projectTasksTableSize: projectTasksSettings?.tableSize,
  })),
)(ProjectTaskTableRoot);

const ProjectTaskDataTable = styled(DataTable)`
  .table {
    .thead .tr .th {
      .resizer {
        display: none;
      }
    }

    .tbody .tr .td{
      padding-top: 0.7rem;
      padding-bottom: 0.7rem;

      &:first-of-type{
        padding-left: 1rem;
      }
      &.td-actions{
        padding-right: 1rem;
      }
    }

    .tbody .tr:last-of-type .td {
      border-bottom: 0;
    }
  }
`;

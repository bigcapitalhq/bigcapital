// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useProjectsListColumns, ActionsMenu } from './components';
import { ProjectsEmptyStatus } from './ProjectsEmptyStatus';
import { useProjectsListContext } from './ProjectsListProvider';
import { withProjectsActions } from './withProjectsActions';
import {
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

/**
 * Projects list datatable.
 * @returns
 */
function ProjectsDataTableInner({
  // #withDial
  openDialog,

  // #withAlertActions
  openAlert,
}) {
  const history = useHistory();

  // Projects list context.
  const {
    projects,
    isEmptyStatus,
    isProjectsLoading,
    isProjectsFetching,
    projectSettings,
  } = useProjectsListContext();
  const projectsTableSize = projectSettings?.tableSize;

  // Retrieve projects table columns.
  const columns = useProjectsListColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.PROJECTS);

  // Handle delete project.
  const handleDeleteProject = ({ id }) => {
    openAlert('project-delete', { projectId: id });
  };

  // Handle project's status button click.
  const handleProjectStatus = ({ id, status_formatted }) => {
    openAlert('project-status', { projectId: id, status: status_formatted });
  };

  // Handle cell click.
  const handleCellClick = ({ row: { original } }) => {
    return history.push(`/projects/${original?.id}/details`, {
      projectId: original.id,
      projectName: original.name,
    });
  };

  // Handle edit project.
  const handleEditProject = (project) => {
    openDialog('project-form', {
      projectId: project.id,
      action: 'edit',
    });
  };
  // Handle new task button click.
  const handleNewTaskButtonClick = (project) => {
    openDialog('project-task-form', {
      projectId: project.id,
    });
  };
  // Handle view detail project.
  const handleViewDetailProject = (project) => {
    return history.push(`/projects/${project.id}/details`, {
      projectId: project.id,
      projectName: project.name,
    });
  };

  // Display project empty status instead of the table.
  if (isEmptyStatus) {
    return <ProjectsEmptyStatus />;
  }

  return (
    <ProjectsTable
      columns={columns}
      data={projects}
      loading={isProjectsLoading}
      headerLoading={isProjectsLoading}
      progressBarLoading={isProjectsFetching}
      manualSortBy={true}
      noInitialFetch={true}
      sticky={true}
      hideTableHeader={true}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      onCellClick={handleCellClick}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      size={projectsTableSize}
      payload={{
        onViewDetails: handleViewDetailProject,
        onEdit: handleEditProject,
        onDelete: handleDeleteProject,
        onNewTask: handleNewTaskButtonClick,
        onStatus: handleProjectStatus,
      }}
    />
  );
}

export const ProjectsDataTable = compose(
  withDialogActions,
  withAlertActions,
  withProjectsActions,
)(ProjectsDataTableInner);

const ProjectsTable = styled(DataTable)`
  .tbody {
    .tr .td {
      padding: 0.75rem 0.8rem;
    }
  }
  .table-size--small {
    .tbody .tr {
      height: 45px;
    }
  }
`;

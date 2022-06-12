import React from 'react';

import { DataTable } from 'components';
import { TABLES } from 'common/tables';

import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import { useProjectsListContext } from './ProjectsListProvider';
import { useMemorizedColumnsWidths } from 'hooks';
import { useProjectsListColumns, ActionsMenu } from '../components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withProjectsActions from './withProjectsActions';
import withSettings from '../../Settings/withSettings';

import { compose } from 'utils';

const projects = [
  {
    id: 1,
    name: 'Project 1',
    description: 'Project 1 description',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Project 2',
    description: 'Project 2 description',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Project 3',
    description: 'Project 3 description',
    status: 'Active',
  },
];

/**
 * Projects list datatable.
 * @returns
 */
function ProjectsDataTable({
  // #withDial
  openDialog,

  // #withSettings
  projectsTableSize,
}) {
  // Retrieve projects table columns.
  const columns = useProjectsListColumns();

  // Handle cell click.
  const handleCellClick = (cell, event) => {};

  // Handle edit project.
  const handleEditProject = (project) => {
    openDialog('project-form', {
      projectId: project.id,
    });
  };

  // Handle new task button click.
  const handleNewTaskButtonClick = () => {
    openDialog('task-form');
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.PROJECTS);

  return (
    <DataTable
      columns={columns}
      data={projects}
      // loading={}
      // headerLoading={}
      // progressBarLoading={}
      manualSortBy={true}
      selectionColumn={true}
      noInitialFetch={true}
      sticky={true}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      onCellClick={handleCellClick}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      size={projectsTableSize}
      payload={{
        onEdit: handleEditProject,
        onNewTask: handleNewTaskButtonClick,
      }}
    />
  );
}

export default compose(
  withDialogActions,
  withProjectsActions,
  withSettings(({ projectSettings }) => ({
    projectsTableSize: projectSettings?.tableSize,
  })),
)(ProjectsDataTable);

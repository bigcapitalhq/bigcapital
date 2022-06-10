import React from 'react';

import { DataTable } from 'components';

import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import { useProjectsListContext } from './ProjectsListProvider';
import { useProjectsListColumns, ActionsMenu } from '../components';

import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

const projects = [
  {
    id: 1,
    name: 'Project 1',
    description: 'Project 1 description',
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
}) {
  // Retrieve projects table columns.
  const columns = useProjectsListColumns();

  // Handle cell click.
  const handleCellClick = (cell, event) => {};

  // Handle new task button click.
  const handleNewTaskButtonClick = () => {
    openDialog('task-form');
  };

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
      payload={{
        onNewTask: handleNewTaskButtonClick,
      }}
    />
  );
}

export default compose(withDialogActions)(ProjectsDataTable);

import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { DataTable } from 'components';
import { TABLES } from 'common/tables';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import { useProjectsListContext } from './ProjectsListProvider';
import { useMemorizedColumnsWidths } from 'hooks';
import { useProjectsListColumns, ActionsMenu } from './components';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withProjectsActions from './withProjectsActions';
import withSettings from '../../../Settings/withSettings';

import { compose } from 'utils';

const projects = [
  {
    id: 1,
    name: 'Maroon Bronze',
    deadline: '2022-06-08T22:00:00.000Z',
    display_name: 'Kyrie Rearden',
    cost_estimate: '40000',
    task_amount: '0',
    is_process: true,
    is_closed: false,
    is_draft: false,
  },
  {
    id: 2,
    name: 'Project Sherwood',
    deadline: '2022-06-08T22:00:00.000Z',
    display_name: 'Ella-Grace Miller',
    cost_estimate: '700',
    task_amount: '300',
    is_process: false,
    is_closed: false,
    is_draft: true,
  },
  {
    id: 3,
    name: 'Tax Compliance',
    deadline: '2022-06-23T22:00:00.000Z',
    display_name: 'Abby & Wells',
    cost_estimate: '3000',
    task_amount: '0',
    is_process: true,
    is_closed: false,
    is_draft: false,
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
  const history = useHistory();

  // Retrieve projects table columns.
  const columns = useProjectsListColumns();

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
    });
  };

  // Handle new task button click.
  const handleNewTaskButtonClick = () => {
    openDialog('project-task-form');
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.PROJECTS);

  // Handle view detail project.
  const handleViewDetailProject = (project) => {
    return history.push(`/projects/${project.id}/details`, {
      projectId: project.id,
      projectName: project.name,
    });
  };

  return (
    <ProjectsTable
      columns={columns}
      data={projects}
      // loading={}
      // headerLoading={}
      // progressBarLoading={}
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

const ProjectsTable = styled(DataTable)`
  .tbody {
    .tr .td {
      padding: 0.5rem 0.8rem;
    }

    .avatar.td {
      .avatar {
        display: inline-block;
        background: #adbcc9;
        border-radius: 8%;
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
`;

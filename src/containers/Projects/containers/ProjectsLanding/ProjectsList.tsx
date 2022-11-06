// @ts-nocheck
import React from 'react';
import { DashboardPageContent, DashboardContentTable } from '@/components';

import ProjectsActionsBar from './ProjectsActionsBar';
import ProjectsViewTabs from './ProjectsViewTabs';
import ProjectsDataTable from './ProjectsDataTable';

import withProjects from './withProjects';
import withProjectsActions from './withProjectsActions';

import { ProjectsListProvider } from './ProjectsListProvider';
import { compose, transformTableStateToQuery } from '@/utils';

/**
 * Projects list.
 * @returns 
 */
function ProjectsList({
  // #withProjects
  projectsTableState,
  projectsTableStateChanged,

  // #withProjectsActions
  resetProjectsTableState,
}) {
  // Resets the projects table state once the page unmount.
  React.useEffect(
    () => () => {
      resetProjectsTableState();
    },
    [resetProjectsTableState],
  );

  return (
    <ProjectsListProvider
      query={transformTableStateToQuery(projectsTableState)}
      tableStateChanged={projectsTableStateChanged}
    >
      <ProjectsActionsBar />
      <DashboardPageContent>
        <ProjectsViewTabs />

        <DashboardContentTable>
          <ProjectsDataTable />
        </DashboardContentTable>
      </DashboardPageContent>
    </ProjectsListProvider>
  );
}

export default compose(
  withProjects(({ projectsTableState, projectsTableStateChanged }) => ({
    projectsTableState,
    projectsTableStateChanged,
  })),
  withProjectsActions,
)(ProjectsList);

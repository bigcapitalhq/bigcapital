// @ts-nocheck
import React from 'react';
import { ProjectsActionsBar } from './ProjectsActionsBar';
import { ProjectsDataTable } from './ProjectsDataTable';
import { ProjectsListProvider } from './ProjectsListProvider';
import { ProjectsViewTabs } from './ProjectsViewTabs';
import { withProjects } from './withProjects';
import { withProjectsActions } from './withProjectsActions';
import { DashboardPageContent, DashboardContentTable } from '@/components';
import { compose, transformTableStateToQuery } from '@/utils';

/**
 * Projects list.
 * @returns
 */
function ProjectsListInner({
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

export const ProjectsList = compose(
  withProjects(({ projectsTableState, projectsTableStateChanged }) => ({
    projectsTableState,
    projectsTableStateChanged,
  })),
  withProjectsActions,
)(ProjectsListInner);

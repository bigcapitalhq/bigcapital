// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';

import { withProjects } from './withProjects';
import { withProjectsActions } from './withProjectsActions';
import { useProjectsListContext } from './ProjectsListProvider';

import { transfromViewsToTabs } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Projects views tabs.
 * @returns
 */
function ProjectsViewTabsInner({
  // #withProjects
  projectsCurrentView,

  // #withProjectsActions
  setProjectsTableState,
}) {
  // Projects list context.
  const { projectsViews } = useProjectsListContext();

  // Projects views.
  const tabs = transfromViewsToTabs(projectsViews);

  // Handle tab change.
  const handleTabsChange = (viewSlug) => {
    setProjectsTableState({ viewSlug: viewSlug || null });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={projectsCurrentView}
          resourceName={'projects'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const ProjectsViewTabs = flow(
  withProjectsActions,
  withProjects(({ projectsTableState }) => ({
    projectsCurrentView: projectsTableState?.viewSlug,
  })),
)(ProjectsViewTabsInner);

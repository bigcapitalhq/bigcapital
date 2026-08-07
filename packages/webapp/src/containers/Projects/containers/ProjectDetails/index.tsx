// @ts-nocheck
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProjectDetailActionsBar } from './ProjectDetailActionsBar';
import { ProjectDetailProvider } from './ProjectDetailProvider';
import { ProjectDetailTabs } from './ProjectDetailTabs';
import { DashboardPageContent } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { compose } from '@/utils';

/**
 * Project tabs.
 * @returns
 */
function ProjectTabs({
  // #withDashboardActions
  changePageTitle,
}) {
  const {
    state: { projectName, projectId },
  } = useLocation();

  useEffect(() => {
    changePageTitle(projectName);
  }, [changePageTitle, projectName]);

  return (
    <ProjectDetailProvider projectId={projectId}>
      <ProjectDetailActionsBar />
      <DashboardPageContent>
        <ProjectDetailTabs />
      </DashboardPageContent>
    </ProjectDetailProvider>
  );
}

export const index = compose(withDashboardActions)(ProjectTabs);

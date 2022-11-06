// @ts-nocheck
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProjectDetailActionsBar from './ProjectDetailActionsBar';
import ProjectDetailTabs from './ProjectDetailTabs';
import { DashboardPageContent } from '@/components';
import { ProjectDetailProvider } from './ProjectDetailProvider';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
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

export default compose(withDashboardActions)(ProjectTabs);

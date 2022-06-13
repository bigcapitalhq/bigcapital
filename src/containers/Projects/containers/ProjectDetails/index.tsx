//@ts-nocheck
import React from 'react';
import { useLocation } from 'react-router-dom';
import ProjectDetailActionsBar from './ProjectDetailActionsBar';
import ProjectDetailTabs from './ProjectDetailTabs';
import { DashboardPageContent } from 'components';
import { ProjectDetailProvider } from './ProjectDetailProvider';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import { compose } from 'utils';

/**
 * Project tabs.
 * @returns
 */
function ProjectTabs({
  // #withDashboardActions
  changePageTitle,
}) {
  const {
    state: { name },
  } = useLocation();

  React.useEffect(() => {
    changePageTitle(name);
  }, [changePageTitle, name]);

  return (
    <ProjectDetailProvider>
      <ProjectDetailActionsBar />
      <DashboardPageContent>
        <ProjectDetailTabs />
      </DashboardPageContent>
    </ProjectDetailProvider>
  );
}

export default compose(withDashboardActions)(ProjectTabs);

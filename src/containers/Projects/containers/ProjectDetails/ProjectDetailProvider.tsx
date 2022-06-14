// @ts-nocheck
import React from 'react';
import DashboardInsider from '../../../../components/Dashboard/DashboardInsider';

const ProjectDetailContext = React.createContext();

/**
 * Project detail provider.
 * @returns
 */
function ProjectDetailProvider({
  // #ownProps
  ...props
}) {
  // State provider.
  const provider = {};
  return (
    <DashboardInsider class="timesheets">
      <ProjectDetailContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useProjectDetailContext = () => React.useContext(ProjectDetailContext);

export { ProjectDetailProvider, useProjectDetailContext };

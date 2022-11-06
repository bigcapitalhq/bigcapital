// @ts-nocheck
import React from 'react';
import { DashboardInsider } from '@/components';
import { useProject } from '../../hooks';

const ProjectDetailContext = React.createContext();

/**
 * Project detail provider.
 * @returns
 */
function ProjectDetailProvider({
  projectId,
  // #ownProps
  ...props
}) {
  // Handle fetch project detail.
  const { data: project, isLoading: isProjectLoading } = useProject(projectId, {
    enabled: !!projectId,
  });

  // State provider.
  const provider = {
    project,
    projectId,
  };
  return (
    <DashboardInsider loading={isProjectLoading}>
      <ProjectDetailContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useProjectDetailContext = () => React.useContext(ProjectDetailContext);

export { ProjectDetailProvider, useProjectDetailContext };

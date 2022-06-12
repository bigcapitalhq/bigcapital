//@ts-nocheck
import React from 'react';
import { useResourceViews, useResourceMeta } from 'hooks/query';
import DashboardInsider from '../../../components/Dashboard/DashboardInsider';

const ProjectsListContext = React.createContext();

/**
 * Projects list data provider.
 * @returns
 */
function ProjectsListProvider({ query, tableStateChanged, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: projectsViews, isLoading: isViewsLoading } =
    useResourceViews('projects');

  // provider payload.
  const provider = {
    projectsViews,
  };

  return (
    <DashboardInsider
      // loading={isViewsLoading}
      name={'projects'}
    >
      <ProjectsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useProjectsListContext = () => React.useContext(ProjectsListContext);

export { ProjectsListProvider, useProjectsListContext };

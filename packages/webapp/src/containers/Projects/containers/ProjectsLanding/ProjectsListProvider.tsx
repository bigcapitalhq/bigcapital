// @ts-nocheck
import React from 'react';
import { isEmpty } from 'lodash';
import { useResourceViews, useResourceMeta } from '@/hooks/query';
import { DashboardInsider } from '@/components';
import { useProjects } from '../../hooks';

const ProjectsListContext = React.createContext();

/**
 * Projects list data provider.
 * @returns
 */
function ProjectsListProvider({ query, tableStateChanged, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: projectsViews, isLoading: isViewsLoading } =
    useResourceViews('projects');

  // Fetch accounts list according to the given custom view id.
  const {
    data: { projects },
    isFetching: isProjectsFetching,
    isLoading: isProjectsLoading,
  } = useProjects(query, { keepPreviousData: true });

  // Determines the datatable empty status.
  const isEmptyStatus =
    isEmpty(projects) && !tableStateChanged && !isProjectsLoading;

  // provider payload.
  const provider = {
    projects,

    projectsViews,

    isProjectsLoading,
    isProjectsFetching,
    isViewsLoading,

    isEmptyStatus,
  };

  return (
    <DashboardInsider loading={isViewsLoading} name={'projects'}>
      <ProjectsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useProjectsListContext = () => React.useContext(ProjectsListContext);

export { ProjectsListProvider, useProjectsListContext };

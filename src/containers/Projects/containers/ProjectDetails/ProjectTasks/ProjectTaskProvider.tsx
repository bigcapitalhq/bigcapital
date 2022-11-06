// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectTasks, useProject } from '../../../hooks';

const ProjectTaskContext = React.createContext();

/**
 * Project task data provider.
 * @returns
 */
function ProjectTaskProvider({ ...props }) {
  const { id } = useParams();
  const projectId = parseInt(id, 10);

  // Handle fetch project tasks.
  const {
    data: { projectTasks },
    isFetching: isProjectTasksFetching,
    isLoading: isProjectTasksLoading,
  } = useProjectTasks(projectId, {
    enabled: !!projectId,
  });

  // Handle fetch project detail.
  const { data: project, isLoading: isProjectLoading } = useProject(projectId, {
    enabled: !!projectId,
  });


  // provider payload.
  const provider = {
    project,
    projectId,
    projectTasks,
    isProjectTasksFetching,
    isProjectTasksLoading,
  };

  return <ProjectTaskContext.Provider value={provider} {...props} />;
}

const useProjectTaskContext = () => React.useContext(ProjectTaskContext);

export { ProjectTaskProvider, useProjectTaskContext };

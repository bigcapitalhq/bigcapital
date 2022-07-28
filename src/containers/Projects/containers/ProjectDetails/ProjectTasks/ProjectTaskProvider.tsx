import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectTasks } from '../../../hooks';

const ProjectTaskContext = React.createContext();

/**
 * Project task data provider.
 * @returns
 */
function ProjectTaskProvider({ ...props }) {
  const { id } = useParams();
  const projectId = parseInt(id, 10);

  const {
    data: { projectTasks },
    isFetching: isProjectTasksFetching,
    isLoading: isProjectTasksLoading,
  } = useProjectTasks(projectId, {
    enabled: !!projectId,
  });

  // provider payload.
  const provider = {
    projectId,
    projectTasks,
    isProjectTasksFetching,
    isProjectTasksLoading,
  };

  return <ProjectTaskContext.Provider value={provider} {...props} />;
}

const useProjectTaskContext = () => React.useContext(ProjectTaskContext);

export { ProjectTaskProvider, useProjectTaskContext };

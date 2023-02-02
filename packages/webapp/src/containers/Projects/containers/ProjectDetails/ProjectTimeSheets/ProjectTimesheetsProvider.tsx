// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProject, useProjectTimeEntries } from '../../../hooks';

const ProjectTimesheetContext = React.createContext();

/**
 * Project timesheets data provider.
 * @returns
 */
function ProjectTimesheetsProvider({ ...props }) {
  const { id } = useParams();
  const projectId = parseInt(id, 10);

  // fetch project time entries.
const {
    data: { projectTimeEntries },
    isLoading: isProjectTimeEntriesLoading,
  } = useProjectTimeEntries(projectId, {
    enabled: !!projectId,
  });

  // Handle fetch project detail.
  const { data: project } = useProject(projectId, {
    enabled: !!projectId,
  });

  // provider payload.
  const provider = {
    projectId,
    project,
    projectTimeEntries,
    isProjectTimeEntriesLoading,
  };

  return <ProjectTimesheetContext.Provider value={provider} {...props} />;
}

const useProjectTimesheetContext = () =>
  React.useContext(ProjectTimesheetContext);

export { ProjectTimesheetsProvider, useProjectTimesheetContext };

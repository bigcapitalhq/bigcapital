// @ts-nocheck
import React from 'react';
import {
  useProjects,
  useProjectTasks,
  useCreateProjectTimeEntry,
  useEditProjectTimeEntry,
  useProjectTimeEntry,
} from '../../hooks';
import { DialogContent } from '@/components';

const ProjecctTimeEntryFormContext = React.createContext();

/**
 * Project time entry form provider.
 * @returns
 */
function ProjectTimeEntryFormProvider({
  // #ownProps
  dialogName,
  projectId,
  timesheetId,
  ...props
}) {
  // project payload.
  const [project, setProjectPayload] = React.useState(projectId);

  // Create and edit project time entry mutations.
  const { mutateAsync: createProjectTimeEntryMutate } =
    useCreateProjectTimeEntry();
  const { mutateAsync: editProjectTimeEntryMutate } = useEditProjectTimeEntry();

  // Handle fetch project tasks.
  const {
    data: { projectTasks },
  } = useProjectTasks(project, {
    enabled: !!project,
  });

  // Handle fetch project time entry detail.
  const { data: projectTimeEntry, isLoading: isProjectTimeEntryLoading } =
    useProjectTimeEntry(timesheetId, {
      enabled: !!timesheetId,
    });

  // Fetch project list data table or list
  const {
    data: { projects },
    isLoading: isProjectsLoading,
  } = useProjects();

  const isNewMode = !timesheetId;

  // provider payload.
  const provider = {
    dialogName,
    projects,
    projectId,
    timesheetId,
    projectTasks,
    isNewMode,
    setProjectPayload,
    projectTimeEntry,
    createProjectTimeEntryMutate,
    editProjectTimeEntryMutate,
  };

  return (
    <DialogContent
      isLoading={isProjectsLoading || isProjectTimeEntryLoading}
      name={'project-time-entry-form'}
    >
      <ProjecctTimeEntryFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useProjectTimeEntryFormContext = () =>
  React.useContext(ProjecctTimeEntryFormContext);

export { ProjectTimeEntryFormProvider, useProjectTimeEntryFormContext };

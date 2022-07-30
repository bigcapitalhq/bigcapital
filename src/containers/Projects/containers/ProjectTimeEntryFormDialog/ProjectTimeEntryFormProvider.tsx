import React from 'react';
import {
  useProjectTasks,
  useCreateProjectTimeEntry,
  useEditProjectTimeEntry,
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
  ...props
}) {
  // Create and edit project time entry mutations.
  const { mutateAsync: createProjectTimeEntryMutate } =
    useCreateProjectTimeEntry();
  const { mutateAsync: editProjectTimeEntryMutate } = useEditProjectTimeEntry();

  // Handle fetch project tasks.
  const {
    data: { projectTasks },
    isLoading: isProjectTasksLoading,
  } = useProjectTasks(projectId, {
    enabled: !!projectId,
  });

  // provider payload.
  const provider = {
    dialogName,
    projectId,
    projectTasks,
    createProjectTimeEntryMutate,
    editProjectTimeEntryMutate,
  };

  return (
    <DialogContent name={'project-time-entry-form'}>
      <ProjecctTimeEntryFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useProjectTimeEntryFormContext = () =>
  React.useContext(ProjecctTimeEntryFormContext);

export { ProjectTimeEntryFormProvider, useProjectTimeEntryFormContext };

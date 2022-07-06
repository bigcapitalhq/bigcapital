import React from 'react';
import { ProjectTimeEntryFormProvider } from './ProjectTimeEntryFormProvider';
import ProjectTimeEntryForm from './ProjectTimeEntryForm';

/**
 * Project time entry form dialog content.
 * @returns {ReactNode}
 */
export default function ProjectTimeEntryFormDialogContent({
  // #ownProps
  dialogName,
  project,
  timeEntry,
}) {
  return (
    <ProjectTimeEntryFormProvider
      projectId={project}
      timeEntryId={timeEntry}
      dialogName={dialogName}
    >
      <ProjectTimeEntryForm />
    </ProjectTimeEntryFormProvider>
  );
}

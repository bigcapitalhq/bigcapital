// @ts-nocheck
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
  timeEntry,
  project,
}) {
  return (
    <ProjectTimeEntryFormProvider
      timesheetId={timeEntry}
      projectId={project}
      dialogName={dialogName}
    >
      <ProjectTimeEntryForm />
    </ProjectTimeEntryFormProvider>
  );
}

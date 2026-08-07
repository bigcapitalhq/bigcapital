// @ts-nocheck
import React from 'react';
import { ProjectTimeEntryForm } from './ProjectTimeEntryForm';
import { ProjectTimeEntryFormProvider } from './ProjectTimeEntryFormProvider';

/**
 * Project time entry form dialog content.
 * @returns {ReactNode}
 */
export function ProjectTimeEntryFormDialogContent({
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

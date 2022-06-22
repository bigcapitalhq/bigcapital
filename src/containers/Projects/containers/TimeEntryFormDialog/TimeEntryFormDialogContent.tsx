import React from 'react';
import { TimeEntryFormProvider } from './TimeEntryFormProvider';
import TimeEntryForm from './TimeEntryForm';

/**
 * Time entry form dialog content.
 * @returns {ReactNode}
 */
export default function TimeEntryFormDialogContent({
  // #ownProps
  dialogName,
  project,
  timeEntry,
}) {
  return (
    <TimeEntryFormProvider
      projectId={project}
      timeEntryId={timeEntry}
      dialogName={dialogName}
    >
      <TimeEntryForm />
    </TimeEntryFormProvider>
  );
}

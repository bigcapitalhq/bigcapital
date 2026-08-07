// @ts-nocheck
import React from 'react';
import { ProjectBillableEntriesForm } from './ProjectBillableEntriesForm';
import { ProjectBillableEntriesFormProvider } from './ProjectBillableEntriesFormProvider';

/**
 * Project billable entries form dialog content.
 * @returns
 */
export function ProjectEntriesFormDialogContent({
  // #ownProps
  dialogName,
  projectId,
}) {
  return (
    <ProjectBillableEntriesFormProvider
      dialogName={dialogName}
      projectId={projectId}
    >
      <ProjectBillableEntriesForm />
    </ProjectBillableEntriesFormProvider>
  );
}

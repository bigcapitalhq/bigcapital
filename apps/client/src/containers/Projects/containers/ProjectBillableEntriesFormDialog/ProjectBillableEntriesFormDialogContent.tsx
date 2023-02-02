// @ts-nocheck
import React from 'react';
import { ProjectBillableEntriesFormProvider } from './ProjectBillableEntriesFormProvider';
import ProjectBillableEntriesForm from './ProjectBillableEntriesForm';

/**
 * Project billable entries form dialog content.
 * @returns
 */
export default function ProjectEntriesFormDialogContent({
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

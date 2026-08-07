// @ts-nocheck
import React from 'react';
import { ProjectForm } from './ProjectForm';
import { ProjectFormProvider } from './ProjectFormProvider';

/**
 * Project form dialog content.
 * @returns {ReactNode}
 */
export function ProjectFormDialogContent({
  // #ownProps
  dialogName,
  project,
}) {
  return (
    <ProjectFormProvider projectId={project} dialogName={dialogName}>
      <ProjectForm />
    </ProjectFormProvider>
  );
}

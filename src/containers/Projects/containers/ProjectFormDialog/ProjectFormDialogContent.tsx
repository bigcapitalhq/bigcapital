// @ts-nocheck
import React from 'react';

import { ProjectFormProvider } from './ProjectFormProvider';
import ProjectForm from './ProjectForm';

/**
 * Project form dialog content.
 * @returns {ReactNode}
 */
export default function ProjectFormDialogContent({
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

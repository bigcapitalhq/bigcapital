import React from 'react';

import { ProjectFormProvider } from './ProjectFormProvider';
import ProjectForm from './ProjectForm';

/**
 * Project dialog content.
 * @returns {ReactNode}
 */
export default function ProjectDialogContent({
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

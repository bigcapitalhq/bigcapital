import React from 'react';

import 'style/pages/Projects/ProjectFormDialog.scss';

import { ProjectFormProvider } from './ProjectFormProvider';
import ProjectForm from './ProjectForm';

/**
 * Project dialog content.
 * @returns
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

// @ts-nocheck
import React from 'react';
import { ProjectTaskForm } from './ProjectTaskForm';
import { ProjectTaskFormProvider } from './ProjectTaskFormProvider';

/**
 * Project task form dialog content.
 */
export function ProjectTaskFormDialogContent({
  // #ownProps
  dialogName,
  task,
  project,
}) {
  return (
    <ProjectTaskFormProvider
      taskId={task}
      projectId={project}
      dialogName={dialogName}
    >
      <ProjectTaskForm />
    </ProjectTaskFormProvider>
  );
}

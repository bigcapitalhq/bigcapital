// @ts-nocheck
import React from 'react';
import { ProjectTaskFormProvider } from './ProjectTaskFormProvider';
import ProjectTaskForm from './ProjectTaskForm';

/**
 * Project task form dialog content.
 */
export default function ProjectTaskFormDialogContent({
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

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
}) {
  return (
    <ProjectTaskFormProvider taskId={task} dialogName={dialogName}>
      <ProjectTaskForm />
    </ProjectTaskFormProvider>
  );
}

import React from 'react';
import { TaskFormProvider } from './TaskFormProvider';
import TaskForm from './TaskForm';

/**
 * Task form dialog content.
 */
export default function TaskFormDialogContent({
  // #ownProps
  dialogName,
  task,
}) {
  return (
    <TaskFormProvider taskId={task} dialogName={dialogName}>
      <TaskForm />
    </TaskFormProvider>
  );
}

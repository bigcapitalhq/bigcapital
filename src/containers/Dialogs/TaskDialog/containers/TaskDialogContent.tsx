import React from 'react';
import { TaskFormProvider } from './TaskFormProvider';
import TaskForm from './TaskForm';

/**
 * Task dialog content.
 */
export default function TaskDialogContent({
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

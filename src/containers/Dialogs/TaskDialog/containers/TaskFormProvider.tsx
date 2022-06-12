//@ts-nocheck
import React from 'react';
import { DialogContent } from 'components';

const TaskFormContext = React.createContext();

/**
 * Task form provider.
 * @returns
 */
function TaskFormProvider({
  // #ownProps
  dialogName,
  taskId,
  ...props
}) {
  // State provider.
  const provider = {
    dialogName,
  };

  return (
    <DialogContent>
      <TaskFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useTaskFormContext = () => React.useContext(TaskFormContext);

export { TaskFormProvider, useTaskFormContext };

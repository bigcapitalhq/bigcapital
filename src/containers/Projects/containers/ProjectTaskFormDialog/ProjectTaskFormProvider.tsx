import React from 'react';
import { DialogContent } from '@/components';

const ProjectTaskFormContext = React.createContext();

/**
 * Project task form provider.
 * @returns
 */
function ProjectTaskFormProvider({
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
      <ProjectTaskFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useProjectTaskFormContext = () =>
  React.useContext(ProjectTaskFormContext);

export { ProjectTaskFormProvider, useProjectTaskFormContext };

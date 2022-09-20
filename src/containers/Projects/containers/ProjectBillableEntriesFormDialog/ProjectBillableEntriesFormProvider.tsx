// @ts-nocheck

import React from 'react';
import { DialogContent } from '@/components';

const ProjectBillableEntriesFormContext = React.createContext();

/**
 * Project billable entries form provider.
 * @returns
 */
function ProjectBillableEntriesFormProvider({
  // #ownProps
  dialogName,
  projectId,
  ...props
}) {
  //state provider.
  const provider = {
    dialogName,
    projectId,
  };

  return (
    <DialogContent>
      <ProjectBillableEntriesFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useProjectBillableEntriesFormContext = () =>
  React.useContext(ProjectBillableEntriesFormContext);

export {
  ProjectBillableEntriesFormProvider,
  useProjectBillableEntriesFormContext,
};

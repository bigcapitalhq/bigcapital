// @ts-nocheck
import React from 'react';

import { DialogContent } from 'components';

const ProjectFormContext = React.createContext();

/**
 * Project form provider.
 * @returns
 */

function ProjectFormProvider({
  // #ownProps
  dialogName,
  projectId,
  ...props
}) {
  // State provider.
  const provider = {};

  return (
    <DialogContent
    // isLoading={}
    >
      <ProjectFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useProjectFormContext = () => React.useContext(ProjectFormContext);

export { ProjectFormProvider, useProjectFormContext };

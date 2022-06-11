// @ts-nocheck
import React from 'react';
import { useCustomers } from 'hooks/query';

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
  // Handle fetch customers data table or list
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers({ page_size: 10000 });

  // State provider.
  const provider = {
    customers,
  };

  return (
    <DialogContent isLoading={isCustomersLoading}>
      <ProjectFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useProjectFormContext = () => React.useContext(ProjectFormContext);

export { ProjectFormProvider, useProjectFormContext };

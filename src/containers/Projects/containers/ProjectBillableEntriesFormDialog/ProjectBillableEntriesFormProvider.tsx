// @ts-nocheck

import React from 'react';
import { useProjectBillableEntries } from '../../hooks';
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
  // Handle fetch project billable entries.
  const {
    data: { billableEntries },
    isLoading: isProjectBillableEntriesLoading,
  } = useProjectBillableEntries(
    projectId,
    {
      billable_type: 'expense',
      to_date: '',
    },
    {
      enabled: !!projectId,
      keepPreviousData: true,
    },
  );

  //state provider.
  const provider = {
    dialogName,
    projectId,
    billableEntries,
  };

  return (
    <DialogContent isLoading={isProjectBillableEntriesLoading}>
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

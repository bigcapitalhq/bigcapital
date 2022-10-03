// @ts-nocheck

import React from 'react';
import { useProjectBillableEntries } from '../../hooks';
import { DialogContent } from '@/components';

const ProjectBillableEntriesContext = React.createContext();

/**
 * Project billable entries provider.
 * @returns
 */
function ProjectBillableEntriesProvider({ projectId, ...props }) {
  // Handle fetch project billable entries.
  const { data: billableEntries, isLoading: isProjectBillableEntriesLoading } =
    useProjectBillableEntries(projectId, {
      enabled: !!projectId,
    });

  //state provider.
  const provider = {
    projectId,
    billableEntries,
  };

  return (
    <DialogContent isLoading={isProjectBillableEntriesLoading}>
      <ProjectBillableEntriesContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useProjectBillableEntriesContext = () =>
  React.useContext(ProjectBillableEntriesContext);

export { ProjectBillableEntriesProvider, useProjectBillableEntriesContext };

// @ts-nocheck

import React from 'react';
import { isEmpty } from 'lodash';
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
  const { data: billableEntries, isLoading: isProjectBillableEntriesLoading } =
    useProjectBillableEntries(
      projectId,
      {
        enabled: !!projectId,
      },
      {
        // billable_type: '',
        // to_date: '',
      },
    );

  // Determines the datatable empty status.
  const isEmptyStatus = isEmpty(billableEntries);

  //state provider.
  const provider = {
    dialogName,
    billableEntries,
    projectId,
    isEmptyStatus,
  };

  return (
    <DialogContent
      name={'project-billable-entries'}
      isLoading={isProjectBillableEntriesLoading}
    >
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

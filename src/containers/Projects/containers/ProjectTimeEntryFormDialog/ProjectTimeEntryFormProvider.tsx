//@ts-nocheck
import React from 'react';
import { DialogContent } from 'components';

const ProjecctTimeEntryFormContext = React.createContext();

/**
 * Project time entry form provider.
 * @returns
 */
function ProjectTimeEntryFormProvider({
  // #ownProps
  dialogName,
  projectId,
  timeEntryId,
  ...props
}) {
  const provider = {
    dialogName,
  };

  return (
    <DialogContent>
      <ProjecctTimeEntryFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useProjectTimeEntryFormContext = () =>
  React.useContext(ProjecctTimeEntryFormContext);

export { ProjectTimeEntryFormProvider, useProjectTimeEntryFormContext };

//@ts-nocheck
import React from 'react';
import { DialogContent } from 'components';

const TimeEntryFormContext = React.createContext();

/**
 * Time entry form provider.
 * @returns
 */
function TimeEntryFormProvider({
  // #ownProps
  dialogName,
  timeEntryId,
  ...props
}) {
  const provider = {
    dialogName,
  };

  return (
    <DialogContent>
      <TimeEntryFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useTimeEntryFormContext = () => React.useContext(TimeEntryFormContext);

export { TimeEntryFormProvider, useTimeEntryFormContext };

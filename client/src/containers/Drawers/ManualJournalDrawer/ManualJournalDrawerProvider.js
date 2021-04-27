import React from 'react';
import { useJournal } from 'hooks/query';
import { DashboardInsider } from 'components';
const ManualJournalDrawerContext = React.createContext();

/**
 * Manual journal drawer provider.
 */
function ManualJournalDrawerProvider({ manualJournalId, ...props }) {
  // fetch the specific manual journal details.
  const { data: manualJournal, isLoading: isJournalLoading } = useJournal(
    manualJournalId,
    {
      enabled: !!manualJournalId,
    },
  );
  // provider.
  const provider = {
    manualJournalId,
    manualJournal,
  };

  return (
    <DashboardInsider loading={isJournalLoading}>
      <ManualJournalDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useManualJournalDrawerContext = () =>
  React.useContext(ManualJournalDrawerContext);

export { ManualJournalDrawerProvider, useManualJournalDrawerContext };

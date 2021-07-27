import React from 'react';
import intl from 'react-intl-universal';
import { useJournal } from 'hooks/query';
import { DashboardInsider, DrawerHeaderContent } from 'components';

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
      <DrawerHeaderContent
        name={'journal-drawer'}
        title={intl.get('manual_journal_number', {
          number: manualJournal?.journal_number,
        })}
      />
      <ManualJournalDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useManualJournalDrawerContext = () =>
  React.useContext(ManualJournalDrawerContext);

export { ManualJournalDrawerProvider, useManualJournalDrawerContext };

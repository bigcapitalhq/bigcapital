import React, {useMemo} from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import MakeJournalEntriesForm from './MakeJournalEntriesForm';
import LoadingIndicator from 'components/LoadingIndicator';
import DashboardConnect from 'connectors/Dashboard.connector';
import {compose} from 'utils';
import MakeJournalEntriesConnect from 'connectors/MakeJournalEntries.connect';
import AccountsConnect from 'connectors/Accounts.connector';

function MakeJournalEntriesPage({
  fetchManualJournal,
  getManualJournal,
  fetchAccounts,
}) {
  const { id } = useParams();

  const fetchJournal = useAsync(() => {
    return Promise.all([
      fetchAccounts(),
      (id) && fetchManualJournal(id),
    ]);
  });
  const editJournal = useMemo(() =>
    getManualJournal(id) || null,
    [getManualJournal, id]);

  return (
    <LoadingIndicator loading={fetchJournal.loading} mount={false}>
      <MakeJournalEntriesForm editJournal={editJournal} />
    </LoadingIndicator>
  );
}

export default compose(
  DashboardConnect,
  AccountsConnect,
  MakeJournalEntriesConnect,
)(MakeJournalEntriesPage);
import React, {useMemo, useCallback} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAsync } from 'react-use';
import MakeJournalEntriesForm from './MakeJournalEntriesForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardConnect from 'connectors/Dashboard.connector';
import {compose} from 'utils';
import MakeJournalEntriesConnect from 'connectors/MakeJournalEntries.connect';
import AccountsConnect from 'connectors/Accounts.connector';

function MakeJournalEntriesPage({
  fetchManualJournal,
  getManualJournal,
  requestFetchAccounts,
}) {
  const history = useHistory();
  const { id } = useParams();

  const fetchJournal = useAsync(() => {
    return Promise.all([
      requestFetchAccounts(),
      (id) && fetchManualJournal(id),
    ]);
  });
  const editJournal = useMemo(() =>
    getManualJournal(id) || null,
    [getManualJournal, id]);

  const handleFormSubmit = useCallback((payload) => {
    payload.redirect && 
      history.push('/dashboard/accounting/manual-journals');
  }, [history]);

  const handleCancel = useCallback(() => {
    history.push('/dashboard/accounting/manual-journals');
  }, [history]);

  return (
    <DashboardInsider loading={fetchJournal.pending} name={'make-journal-page'}>
      <MakeJournalEntriesForm
        onFormSubmit={handleFormSubmit}
        editJournal={editJournal}
        onCancelForm={handleCancel} />
    </DashboardInsider>
  );
}

export default compose(
  DashboardConnect,
  AccountsConnect,
  MakeJournalEntriesConnect,
)(MakeJournalEntriesPage);
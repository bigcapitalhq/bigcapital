import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import MakeJournalEntriesForm from './MakeJournalEntriesForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';

import {compose} from 'utils';


function MakeJournalEntriesPage({
  requestFetchManualJournal,
  requestFetchAccounts,
}) {
  const history = useHistory();
  const { id } = useParams();

  const fetchAccounts = useQuery('accounts-list',
    (key) => requestFetchAccounts());

  const fetchJournal = useQuery(
    id && ['manual-journal', id],
    (key, journalId) => requestFetchManualJournal(journalId));

  const handleFormSubmit = useCallback((payload) => {
    payload.redirect && 
      history.push('/dashboard/accounting/manual-journals');
  }, [history]);

  const handleCancel = useCallback(() => {
    history.push('/dashboard/accounting/manual-journals');
  }, [history]);

  return (
    <DashboardInsider
      loading={fetchJournal.isFetching || fetchAccounts.isFetching}
      name={'make-journal-page'}>
      <MakeJournalEntriesForm
        onFormSubmit={handleFormSubmit}
        manualJournalId={id}
        onCancelForm={handleCancel} />
    </DashboardInsider>
  );
}

export default compose(
  // DashboardConnect,
  withAccountsActions,
  withManualJournalsActions,
)(MakeJournalEntriesPage);
import React, { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import MakeJournalEntriesForm from './MakeJournalEntriesForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function MakeJournalEntriesPage({
  // #withCustomersActions
  requestFetchCustomers,

  // #withAccountsActions
  requestFetchAccounts,

  // #withManualJournalActions
  requestFetchManualJournal,

  // #wihtCurrenciesActions
  requestFetchCurrencies,

  // #withSettingsActions
  requestFetchOptions,

  // #withDashboardActions
  setSidebarShrink,
  resetSidebarPreviousExpand,
  setDashboardBackLink
}) {
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    // Shrink the sidebar by foce.
    setSidebarShrink();
    // Show the back link on dashboard topbar.
    setDashboardBackLink('/manual-journals');

    return () => {
      // Reset the sidebar to the previous status.
      resetSidebarPreviousExpand();
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  }, [resetSidebarPreviousExpand, setSidebarShrink]);

  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  const fetchCustomers = useQuery('customers-list', (key) =>
    requestFetchCustomers(),
  );

  const fetchCurrencies = useQuery('currencies', () =>
    requestFetchCurrencies(),
  );

  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  const fetchJournal = useQuery(
    ['manual-journal', id],
    (key, journalId) => requestFetchManualJournal(journalId),
    { enabled: id && id },
  );

  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/manual-journals');
    },
    [history],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={
        fetchJournal.isFetching ||
        fetchAccounts.isFetching ||
        fetchCurrencies.isFetching ||
        fetchCustomers.isFetching
      }
      name={'make-journal-page'}
    >
      <MakeJournalEntriesForm
        onFormSubmit={handleFormSubmit}
        manualJournalId={id}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(
  withAccountsActions,
  withCustomersActions,
  withManualJournalsActions,
  withCurrenciesActions,
  withSettingsActions,
  withDashboardActions,
)(MakeJournalEntriesPage);

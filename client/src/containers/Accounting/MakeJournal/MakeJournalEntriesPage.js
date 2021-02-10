import React, { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import MakeJournalEntriesForm from './MakeJournalEntriesForm';
import { MakeJournalProvider } from './MakeJournalProvider';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

import 'style/pages/ManualJournal/MakeJournal.scss';

/**
 * Make journal entries page.
 */
function MakeJournalEntriesPage({
  // #withDashboardActions
  setSidebarShrink,
  resetSidebarPreviousExpand,
  setDashboardBackLink,
}) {
  const history = useHistory();
  const { id: journalId } = useParams();

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
  }, [resetSidebarPreviousExpand, setDashboardBackLink, setSidebarShrink]);

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
    <MakeJournalProvider journalId={journalId}>
      <MakeJournalEntriesForm
        onFormSubmit={handleFormSubmit}
        onCancelForm={handleCancel}
      />
    </MakeJournalProvider>
  );
}

export default compose(
  withDashboardActions,
)(MakeJournalEntriesPage);

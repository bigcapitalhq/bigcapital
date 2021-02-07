import React, { useEffect, useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
  FormattedMessage as T,
  useIntl,
} from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import { ManualJournalsListProvider } from './ManualJournalsListProvider';
import ManualJournalsAlerts from './ManualJournalsAlerts';
import ManualJournalsViewTabs from './ManualJournalsViewTabs';
import ManualJournalsDataTable from './ManualJournalsDataTable';
import ManualJournalsActionsBar from './ManualJournalActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withManualJournals from 'containers/Accounting/withManualJournals';

import { compose } from 'utils';

import 'style/pages/ManualJournal/List.scss';


/**
 * Manual journals table.
 */
function ManualJournalsTable({
  // #withDashboardActions
  changePageTitle,

  // #withManualJournals
  manualJournalsTableQuery,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();

  // Handle update the page title.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'manual_journals' }));
  }, [changePageTitle, formatMessage]);

  const handleEditJournal = useCallback(
    (journal) => {
      history.push(`/manual-journals/${journal.id}/edit`);
    },
    [history],
  );

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, []);

  return (
    <ManualJournalsListProvider query={manualJournalsTableQuery}>
      <ManualJournalsActionsBar />

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/manual-journals/:custom_view_id/custom_view',
              '/manual-journals',
            ]}
          >
            <ManualJournalsViewTabs />
            <ManualJournalsDataTable />
            <ManualJournalsAlerts />
          </Route>
        </Switch>
      </DashboardPageContent>
    </ManualJournalsListProvider>
  );
}

export default compose(
  withDashboardActions,
  withManualJournals(({ manualJournalsTableQuery }) => ({
    manualJournalsTableQuery,
  })),
)(ManualJournalsTable);

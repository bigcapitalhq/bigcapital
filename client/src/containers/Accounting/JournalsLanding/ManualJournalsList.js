import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import { DashboardContentTable, DashboardPageContent } from 'components';

import { ManualJournalsListProvider } from './ManualJournalsListProvider';
import ManualJournalsAlerts from './ManualJournalsAlerts';
import ManualJournalsViewTabs from './ManualJournalsViewTabs';
import ManualJournalsDataTable from './ManualJournalsDataTable';
import ManualJournalsActionsBar from './ManualJournalActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withManualJournals from './withManualJournals';

import { transformTableStateToQuery, compose } from 'utils';

import 'style/pages/ManualJournal/List.scss';

/**
 * Manual journals table.
 */
function ManualJournalsTable({
  // #withDashboardActions
  changePageTitle,

  // #withManualJournals
  journalsTableState,
}) {
  const { formatMessage } = useIntl();

  // Handle update the page title.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'manual_journals' }));
  }, [changePageTitle, formatMessage]);

  return (
    <ManualJournalsListProvider
      query={transformTableStateToQuery(journalsTableState)}
    >
      <ManualJournalsActionsBar />

      <DashboardPageContent>
        <ManualJournalsViewTabs />

        <DashboardContentTable>
          <ManualJournalsDataTable />
        </DashboardContentTable>

        <ManualJournalsAlerts />
      </DashboardPageContent>
    </ManualJournalsListProvider>
  );
}

export default compose(
  withDashboardActions,
  withManualJournals(({ manualJournalsTableState }) => ({
    journalsTableState: manualJournalsTableState,
  })),
)(ManualJournalsTable);

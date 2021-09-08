import React from 'react';

import 'style/pages/ManualJournal/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';

import { ManualJournalsListProvider } from './ManualJournalsListProvider';
import ManualJournalsAlerts from './ManualJournalsAlerts';
import ManualJournalsViewTabs from './ManualJournalsViewTabs';
import ManualJournalsDataTable from './ManualJournalsDataTable';
import ManualJournalsActionsBar from './ManualJournalActionsBar';

import withManualJournals from './withManualJournals';
import { transformTableStateToQuery, compose } from 'utils';

/**
 * Manual journals table.
 */
function ManualJournalsTable({
  // #withManualJournals
  journalsTableState,
  journalsTableStateChanged,
}) {
  return (
    <ManualJournalsListProvider
      query={transformTableStateToQuery(journalsTableState)}
      tableStateChanged={journalsTableStateChanged}
    >
      <ManualJournalsActionsBar />

      <DashboardPageContent>
        <ManualJournalsViewTabs />
        <ManualJournalsDataTable />
      </DashboardPageContent>

      <ManualJournalsAlerts />
    </ManualJournalsListProvider>
  );
}

export default compose(
  withManualJournals(
    ({ manualJournalsTableState, manualJournalTableStateChanged }) => ({
      journalsTableState: manualJournalsTableState,
      journalsTableStateChanged: manualJournalTableStateChanged,
    }),
  ),
)(ManualJournalsTable);

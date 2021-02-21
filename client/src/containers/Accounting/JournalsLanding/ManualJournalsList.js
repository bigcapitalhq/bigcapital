import React from 'react';

import { DashboardContentTable, DashboardPageContent } from 'components';

import { ManualJournalsListProvider } from './ManualJournalsListProvider';
import ManualJournalsAlerts from './ManualJournalsAlerts';
import ManualJournalsViewTabs from './ManualJournalsViewTabs';
import ManualJournalsDataTable from './ManualJournalsDataTable';
import ManualJournalsActionsBar from './ManualJournalActionsBar';

import withManualJournals from './withManualJournals';

import { transformTableStateToQuery, compose } from 'utils';

import 'style/pages/ManualJournal/List.scss';

/**
 * Manual journals table.
 */
function ManualJournalsTable({
  // #withManualJournals
  journalsTableState,
}) {
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
  withManualJournals(({ manualJournalsTableState }) => ({
    journalsTableState: manualJournalsTableState,
  })),
)(ManualJournalsTable);

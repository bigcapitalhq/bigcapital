// @ts-nocheck
import React from 'react';

import '@/style/pages/ManualJournal/List.scss';

import { DashboardPageContent } from '@/components';
import { transformTableStateToQuery, compose } from '@/utils';

import { ManualJournalsListProvider } from './ManualJournalsListProvider';
import ManualJournalsDataTable from './ManualJournalsDataTable';
import ManualJournalsActionsBar from './ManualJournalActionsBar';
import withManualJournals from './withManualJournals';


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
        <ManualJournalsDataTable />
      </DashboardPageContent>
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

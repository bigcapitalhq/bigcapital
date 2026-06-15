// @ts-nocheck
import React from 'react';

import '@/style/pages/ManualJournal/List.scss';

import { DashboardPageContent } from '@/components';
import { transformTableStateToQuery } from '@/utils';

import { ManualJournalsListProvider } from './ManualJournalsListProvider';
import { ManualJournalsDataTable } from './ManualJournalsDataTable';
import { ManualJournalActionsBar as ManualJournalsActionsBar } from './ManualJournalActionsBar';
import { withManualJournals } from './withManualJournals';
import { flow } from 'fp-ts/function';

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

export const ManualJournalsList = flow(
  withManualJournals(
    ({ manualJournalsTableState, manualJournalTableStateChanged }) => ({
      journalsTableState: manualJournalsTableState,
      journalsTableStateChanged: manualJournalTableStateChanged,
    }),
  ),
)(ManualJournalsTable);

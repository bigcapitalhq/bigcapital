import '@/style/pages/ManualJournal/List.scss';

import { useEffect } from 'react';
import { ManualJournalActionsBar as ManualJournalsActionsBar } from './ManualJournalActionsBar';
import { ManualJournalsDataTable } from './ManualJournalsDataTable';
import { ManualJournalsListDialogs } from './ManualJournalsListDialogs';
import { ManualJournalsListDrawers } from './ManualJournalsListDrawers';
import { ManualJournalsListProvider } from './ManualJournalsListProvider';
import { withManualJournals } from './withManualJournals';
import { withManualJournalsActions } from './withManualJournalsActions';
import type { WithManualJournalsProps } from './withManualJournals';
import { DashboardPageContent } from '@/components';
import { transformTableStateToQuery, compose } from '@/utils';

// The withManualJournals mapper below renames `manualJournalsTableState` →
// `journalsTableState` and `manualJournalTableStateChanged` →
// `journalsTableStateChanged`. Pick<...> can't rename, so re-typing is required.
interface ManualJournalsTableProps {
  journalsTableState: WithManualJournalsProps['manualJournalsTableState'];
  journalsTableStateChanged: WithManualJournalsProps['manualJournalTableStateChanged'];
}

/**
 * Manual journals table.
 */
function ManualJournalsTable({
  // #withManualJournals
  journalsTableState,
  journalsTableStateChanged,

  // #withManualJournalsActions
  resetManualJournalsSelectedRows,
}: ManualJournalsTableProps & {
  resetManualJournalsSelectedRows: () => void;
}) {
  // Resets the selected rows once the page unmount.
  useEffect(
    () => () => {
      resetManualJournalsSelectedRows();
    },
    [resetManualJournalsSelectedRows],
  );

  return (
    <ManualJournalsListProvider
      query={transformTableStateToQuery(journalsTableState)}
      tableStateChanged={journalsTableStateChanged}
    >
      <ManualJournalsActionsBar />
      <ManualJournalsListDrawers />
      <ManualJournalsListDialogs />

      <DashboardPageContent>
        <ManualJournalsDataTable />
      </DashboardPageContent>
    </ManualJournalsListProvider>
  );
}

export const ManualJournalsList = compose(
  withManualJournalsActions,
  withManualJournals(
    ({ manualJournalsTableState, manualJournalTableStateChanged }) => ({
      journalsTableState: manualJournalsTableState,
      journalsTableStateChanged: manualJournalTableStateChanged,
    }),
  ),
)(ManualJournalsTable);

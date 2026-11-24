import * as FF from 'fp-ts/function';
import { useHistory } from 'react-router-dom';
import { ActionsMenu } from './components';
import { ManualJournalsEmptyStatus } from './ManualJournalsEmptyStatus';
import { useManualJournalsContext } from './ManualJournalsListProvider';
import { useManualJournalsColumns } from './utils';
import { withManualJournals } from './withManualJournals';
import { withManualJournalsActions } from './withManualJournalsActions';
import type { ManualJournalTableRow } from './components';
import type { WithManualJournalsProps } from './withManualJournals';
import type { WithManualJournalsActionsProps } from './withManualJournalsActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.MANUAL_JOURNALS,
  rowName: 'manual-journal',
  identifierColumn: 'journal_number',
  ActionsMenu,
});

interface ManualJournalsDataTableProps
  extends Pick<
      WithManualJournalsProps,
      'manualJournalsTableState' | 'manualJournalsSelectedRows'
    >,
    WithManualJournalsActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {}

/**
 * Manual journals data-table.
 */
function ManualJournalsDataTableInner({
  // #withManualJournalsActions
  setManualJournalsTableState,
  setManualJournalsSelectedRows,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withManualJournals
  manualJournalsTableState,
  manualJournalsSelectedRows,
}: ManualJournalsDataTableProps) {
  // Manual journals context.
  const {
    manualJournals,
    pagination,
    isManualJournalsLoading,
    isManualJournalsFetching,
    isEmptyStatus,
    manualJournalsSettings,
  } = useManualJournalsContext();

  const history = useHistory();

  // Manual journals columns.
  const columns = useManualJournalsColumns();

  // Handles the journal publish action.
  const handlePublishJournal = ({ id }: ManualJournalTableRow) => {
    openAlert('journal-publish', { manualJournalId: id });
  };
  // Handle the journal edit action.
  const handleEditJournal = ({ id }: ManualJournalTableRow) => {
    history.push(`/manual-journals/${id}/edit`);
  };
  // Handle the journal delete action.
  const handleDeleteJournal = ({ id }: ManualJournalTableRow) => {
    openAlert('journal-delete', { manualJournalId: id });
  };
  // Handle view detail journal.
  const handleViewDetailJournal = ({ id }: ManualJournalTableRow) => {
    openDrawer(DRAWERS.JOURNAL_DETAILS, {
      manualJournalId: id,
    });
  };

  // Display manual journal empty status instead of the table.
  if (isEmptyStatus) {
    return <ManualJournalsEmptyStatus />;
  }

  return (
    <Table
      columns={columns}
      data={manualJournals}
      total={pagination?.total}
      loading={isManualJournalsLoading}
      fetching={isManualJournalsFetching}
      compact={manualJournalsSettings?.tableSize === 'small'}
      query={manualJournalsTableState}
      setQuery={setManualJournalsTableState}
      selectedIds={manualJournalsSelectedRows}
      setSelectedIds={setManualJournalsSelectedRows}
      actions={{
        onDelete: handleDeleteJournal,
        onPublish: handlePublishJournal,
        onEdit: handleEditJournal,
        onViewDetails: handleViewDetailJournal,
      }}
    />
  );
}

export const ManualJournalsDataTable = FF.pipe(
  ManualJournalsDataTableInner,
  withDrawerActions,
  withAlertActions,
  withManualJournals(
    ({ manualJournalsTableState, manualJournalsSelectedRows }) => ({
      manualJournalsTableState,
      manualJournalsSelectedRows,
    }),
  ),
  withManualJournalsActions,
);

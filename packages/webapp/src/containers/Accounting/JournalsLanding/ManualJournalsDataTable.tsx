import React, { useCallback } from 'react';
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
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface ManualJournalsDataTableProps
  extends Pick<WithManualJournalsProps, 'manualJournalsTableState'>,
    WithManualJournalsActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {
  onSelectedRowsChange?: (selectedFlatRows: unknown) => void;
}

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

  // #ownProps
  onSelectedRowsChange,
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
  const manualJournalsTableSize = manualJournalsSettings?.tableSize as
    | string
    | undefined;

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
  // Handle cell click.
  const handleCellClick = (
    cell: { row: { original: ManualJournalTableRow } },
    _event: React.MouseEvent,
  ) => {
    openDrawer(DRAWERS.JOURNAL_DETAILS, {
      manualJournalId: cell.row.original.id,
    });
  };
  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.MANUAL_JOURNALS);

  // Handle fetch data once the page index, size or sort by of the table change.
  const handleFetchData = useCallback(
    ({
      pageSize,
      pageIndex,
      sortBy,
    }: {
      pageSize: number;
      pageIndex: number;
      sortBy: Array<{ id: string; desc: boolean }>;
    }) => {
      setManualJournalsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setManualJournalsTableState],
  );
  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (selectedFlatRows: Array<{ original: ManualJournalTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setManualJournalsSelectedRows(selectedIds);
      onSelectedRowsChange?.(selectedFlatRows);
    },
    [setManualJournalsSelectedRows, onSelectedRowsChange],
  );

  // Display manual journal empty status instead of the table.
  if (isEmptyStatus) {
    return <ManualJournalsEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={manualJournals ?? []}
        manualSortBy={true}
        selectionColumn={true}
        sticky={true}
        loading={isManualJournalsLoading}
        headerLoading={isManualJournalsLoading}
        progressBarLoading={isManualJournalsFetching}
        pagination={true}
        initialPageSize={manualJournalsTableState?.pageSize ?? 10}
        rowsCount={pagination?.total ?? 0}
        autoResetSortBy={false}
        autoResetPage={false}
        onSelectedRowsChange={handleSelectedRowsChange}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onFetchData={handleFetchData}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={manualJournalsTableSize}
        payload={{
          onDelete: handleDeleteJournal,
          onPublish: handlePublishJournal,
          onEdit: handleEditJournal,
          onViewDetails: handleViewDetailJournal,
        }}
      />
    </DashboardContentTable>
  );
}

export const ManualJournalsDataTable = compose(
  withManualJournalsActions,
  withManualJournals(({ manualJournalsTableState }) => ({
    manualJournalsTableState,
  })),
  withAlertActions,
  withDrawerActions,
)(ManualJournalsDataTableInner);

import { Alert, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React, { useCallback, useState } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { ActionsMenu, useRecurringJournalsTableColumns } from './components';
import { useRecurringJournalsListContext } from './RecurringJournalsListProvider';
import { withRecurringJournals } from './withRecurringJournals';
import { withRecurringJournalsActions } from './withRecurringJournalsActions';
import type { RecurringJournalTableRow } from './components';
import type { WithRecurringJournalsProps } from './withRecurringJournals';
import type { WithRecurringJournalsActionsProps } from './withRecurringJournalsActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  AppToaster,
  DataTable,
  DashboardContentTable,
  TableSkeletonHeader,
  TableSkeletonRows,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import {
  useDeleteRecurringJournal,
  useGenerateRecurringJournalNow,
  usePauseRecurringJournal,
  useResumeRecurringJournal,
} from '@/ee/recurring-journals/hooks/query';
import { useMemorizedColumnsWidths } from '@/hooks';

interface RecurringJournalsDataTableProps
  extends Pick<
      WithRecurringJournalsProps,
      'recurringJournalsTableState' | 'recurringJournalsSelectedRows'
    >,
    WithRecurringJournalsActionsProps,
    WithDrawerActionsProps {}

function RecurringJournalsDataTableInner({
  setRecurringJournalsTableState,
  setRecurringJournalsSelectedRows,
  recurringJournalsTableState,
  recurringJournalsSelectedRows,
  // #withDrawerActions
  openDrawer,
}: RecurringJournalsDataTableProps) {
  const history = useHistory();
  const {
    recurringJournals,
    pagination,
    isEmptyStatus,
    isRecurringJournalsLoading,
    isRecurringJournalsFetching,
    manualJournalsSettings,
  } = useRecurringJournalsListContext();

  const columns = useRecurringJournalsTableColumns();

  const { mutateAsync: deleteRecurringJournal } = useDeleteRecurringJournal();
  const { mutateAsync: pauseRecurringJournal } = usePauseRecurringJournal();
  const { mutateAsync: resumeRecurringJournal } = useResumeRecurringJournal();
  const { mutateAsync: generateNow } = useGenerateRecurringJournalNow();

  const [deleteTarget, setDeleteTarget] =
    useState<RecurringJournalTableRow | null>(null);

  const handleEdit = (recurringJournal: RecurringJournalTableRow) => {
    history.push(`/recurring-journals/${recurringJournal.id}/edit`);
  };

  const handleViewDetails = (recurringJournal: RecurringJournalTableRow) => {
    openDrawer(DRAWERS.RECURRING_JOURNAL_DETAILS, {
      recurringJournalId: recurringJournal.id,
      tab: 'details',
    });
  };

  const handleViewJournals = (recurringJournal: RecurringJournalTableRow) => {
    openDrawer(DRAWERS.RECURRING_JOURNAL_DETAILS, {
      recurringJournalId: recurringJournal.id,
      tab: 'journals',
    });
  };

  const handlePause = async (recurringJournal: RecurringJournalTableRow) => {
    try {
      await pauseRecurringJournal(recurringJournal.id);
      AppToaster.show({
        message: intl.get('recurring_journal.paused_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handleResume = async (recurringJournal: RecurringJournalTableRow) => {
    try {
      await resumeRecurringJournal(recurringJournal.id);
      AppToaster.show({
        message: intl.get('recurring_journal.resumed_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handleGenerate = async (recurringJournal: RecurringJournalTableRow) => {
    try {
      await generateNow(recurringJournal.id);
      AppToaster.show({
        message: intl.get('recurring_journal.generated_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    try {
      await deleteRecurringJournal(deleteTarget.id);
      AppToaster.show({
        message: intl.get('recurring_journal.deleted_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.RECURRING_JOURNALS);

  const handleFetchData = useCallback(
    ({
      pageIndex,
      pageSize,
      sortBy,
    }: {
      pageIndex: number;
      pageSize: number;
      sortBy: Array<{ id: string; desc: boolean }>;
    }) => {
      setRecurringJournalsTableState({ pageIndex, pageSize, sortBy });
    },
    [setRecurringJournalsTableState],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedFlatRows: Array<{ original: RecurringJournalTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setRecurringJournalsSelectedRows(selectedIds);
    },
    [setRecurringJournalsSelectedRows],
  );

  const handleCellClick = (cell: any) => {
    openDrawer(DRAWERS.RECURRING_JOURNAL_DETAILS, {
      recurringJournalId: cell.row.original.id,
      tab: 'details',
    });
  };

  if (isEmptyStatus) {
    return null;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={recurringJournals ?? []}
        loading={isRecurringJournalsLoading}
        headerLoading={isRecurringJournalsLoading}
        progressBarLoading={isRecurringJournalsFetching}
        onFetchData={handleFetchData}
        onSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsIds={recurringJournalsSelectedRows}
        autoResetSelectedRows={false}
        noInitialFetch={true}
        manualSortBy={true}
        selectionColumn={false}
        sticky={true}
        pagination={true}
        initialPageSize={recurringJournalsTableState?.pageSize ?? 20}
        manualPagination={true}
        rowsCount={pagination?.total ?? 0}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        rowTestId={'recurring-journal-row'}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={manualJournalsSettings?.tableSize as string | undefined}
        payload={{
          onEdit: handleEdit,
          onViewDetails: handleViewDetails,
          onViewJournals: handleViewJournals,
          onPause: handlePause,
          onResume: handleResume,
          onGenerate: handleGenerate,
          onDelete: (row: RecurringJournalTableRow) => setDeleteTarget(row),
        }}
      />

      <Alert
        isOpen={!!deleteTarget}
        intent={Intent.DANGER}
        icon="trash"
        cancelButtonText={intl.get('cancel')}
        confirmButtonText={intl.get('delete')}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      >
        <p>{intl.get('recurring_journal.delete_confirmation')}</p>
      </Alert>
    </DashboardContentTable>
  );
}

export const RecurringJournalsDataTable = FF.pipe(
  RecurringJournalsDataTableInner,
  withRecurringJournals(
    ({ recurringJournalsTableState, recurringJournalsSelectedRows }) => ({
      recurringJournalsTableState,
      recurringJournalsSelectedRows,
    }),
  ),
  withRecurringJournalsActions,
  withDrawerActions,
);

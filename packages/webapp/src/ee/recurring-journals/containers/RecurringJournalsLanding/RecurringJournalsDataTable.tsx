import { Alert, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React, { useState } from 'react';
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
import { AppToaster } from '@/components';
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { isSmallTableSize, TABLES } from '@/constants/tables';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import {
  useDeleteRecurringJournal,
  useGenerateRecurringJournalNow,
  usePauseRecurringJournal,
  useResumeRecurringJournal,
} from '@/ee/recurring-journals/hooks/query';

const Table = createDashboardListTable({
  tableName: TABLES.RECURRING_JOURNALS,
  rowName: 'recurring-journal',
  identifierColumn: 'profile_name',
  ActionsMenu,
});

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

  if (isEmptyStatus) {
    return null;
  }

  return (
    <>
      <Table
        columns={columns}
        data={recurringJournals}
        total={pagination?.total}
        loading={isRecurringJournalsLoading}
        fetching={isRecurringJournalsFetching}
        compact={isSmallTableSize(manualJournalsSettings?.tableSize)}
        query={recurringJournalsTableState}
        setQuery={setRecurringJournalsTableState}
        selectedIds={recurringJournalsSelectedRows}
        setSelectedIds={setRecurringJournalsSelectedRows}
        actions={{
          onEdit: handleEdit,
          onViewDetails: handleViewDetails,
          onViewJournals: handleViewJournals,
          onPause: handlePause,
          onResume: handleResume,
          onGenerate: handleGenerate,
          onDelete: setDeleteTarget,
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
    </>
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

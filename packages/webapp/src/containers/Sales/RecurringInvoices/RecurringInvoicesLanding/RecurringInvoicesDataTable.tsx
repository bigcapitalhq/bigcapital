import { Alert, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { ActionsMenu, useRecurringInvoicesTableColumns } from './components';
import { useRecurringInvoicesListContext } from './RecurringInvoicesListProvider';
import { withRecurringInvoices } from './withRecurringInvoices';
import { withRecurringInvoicesActions } from './withRecurringInvoicesActions';
import type { RecurringInvoiceTableRow } from './components';
import type { WithRecurringInvoicesProps } from './withRecurringInvoices';
import type { WithRecurringInvoiceActionsProps } from './withRecurringInvoicesActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { createSalesListTable } from '@/containers/Sales/SalesListTable';
import {
  useDeleteRecurringInvoice,
  useGenerateRecurringInvoiceNow,
  usePauseRecurringInvoice,
  useResumeRecurringInvoice,
} from '@/hooks/query';

const Table = createSalesListTable({
  tableName: TABLES.RECURRING_INVOICES,
  rowName: 'recurring-invoice',
  identifierColumn: 'profile_name',
  ActionsMenu,
});

interface RecurringInvoicesDataTableProps
  extends Pick<
      WithRecurringInvoicesProps,
      'recurringInvoicesTableState' | 'recurringInvoicesSelectedRows'
    >,
    WithRecurringInvoiceActionsProps,
    WithDrawerActionsProps {}

function RecurringInvoicesDataTableInner({
  setRecurringInvoicesTableState,
  setRecurringInvoicesSelectedRows,
  recurringInvoicesTableState,
  recurringInvoicesSelectedRows,
  // #withDrawerActions
  openDrawer,
}: RecurringInvoicesDataTableProps) {
  const history = useHistory();
  const {
    recurringInvoices,
    pagination,
    isEmptyStatus,
    isRecurringInvoicesLoading,
    isRecurringInvoicesFetching,
    invoicesSettings,
  } = useRecurringInvoicesListContext();

  const columns = useRecurringInvoicesTableColumns();

  const { mutateAsync: deleteRecurringInvoice } = useDeleteRecurringInvoice();
  const { mutateAsync: pauseRecurringInvoice } = usePauseRecurringInvoice();
  const { mutateAsync: resumeRecurringInvoice } = useResumeRecurringInvoice();
  const { mutateAsync: generateNow } = useGenerateRecurringInvoiceNow();

  const [deleteTarget, setDeleteTarget] =
    useState<RecurringInvoiceTableRow | null>(null);

  const handleEdit = (recurringInvoice: RecurringInvoiceTableRow) => {
    history.push(`/recurring-invoices/${recurringInvoice.id}/edit`);
  };

  const handleViewDetails = (recurringInvoice: RecurringInvoiceTableRow) => {
    openDrawer(DRAWERS.RECURRING_INVOICE_DETAILS, {
      recurringInvoiceId: recurringInvoice.id,
      tab: 'details',
    });
  };

  const handleViewInvoices = (recurringInvoice: RecurringInvoiceTableRow) => {
    openDrawer(DRAWERS.RECURRING_INVOICE_DETAILS, {
      recurringInvoiceId: recurringInvoice.id,
      tab: 'invoices',
    });
  };

  const handlePause = async (recurringInvoice: RecurringInvoiceTableRow) => {
    try {
      await pauseRecurringInvoice(recurringInvoice.id);
      AppToaster.show({
        message: intl.get('recurring_invoice.paused_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handleResume = async (recurringInvoice: RecurringInvoiceTableRow) => {
    try {
      await resumeRecurringInvoice(recurringInvoice.id);
      AppToaster.show({
        message: intl.get('recurring_invoice.resumed_successfully'),
        intent: Intent.SUCCESS,
      });
    } catch (_error) {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
    }
  };

  const handleGenerate = async (recurringInvoice: RecurringInvoiceTableRow) => {
    try {
      await generateNow(recurringInvoice.id);
      AppToaster.show({
        message: intl.get('recurring_invoice.generated_successfully'),
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
      await deleteRecurringInvoice(deleteTarget.id);
      AppToaster.show({
        message: intl.get('recurring_invoice.deleted_successfully'),
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

  const handleCancelDelete = () => setDeleteTarget(null);

  if (isEmptyStatus) {
    return null;
  }

  const actions = {
    onEdit: handleEdit,
    onViewDetails: handleViewDetails,
    onViewInvoices: handleViewInvoices,
    onPause: handlePause,
    onResume: handleResume,
    onGenerate: handleGenerate,
    onDelete: setDeleteTarget,
  };

  return (
    <>
      <Table
        columns={columns}
        data={recurringInvoices}
        total={pagination?.total}
        loading={isRecurringInvoicesLoading}
        fetching={isRecurringInvoicesFetching}
        compact={invoicesSettings?.tableSize === 'small'}
        query={recurringInvoicesTableState}
        setQuery={setRecurringInvoicesTableState}
        selectedIds={recurringInvoicesSelectedRows}
        setSelectedIds={setRecurringInvoicesSelectedRows}
        actions={actions}
      />
      <Alert
        isOpen={!!deleteTarget}
        intent={Intent.DANGER}
        icon="trash"
        cancelButtonText={intl.get('cancel')}
        confirmButtonText={intl.get('delete')}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      >
        <p>{intl.get('recurring_invoice.delete_confirmation')}</p>
      </Alert>
    </>
  );
}

export const RecurringInvoicesDataTable = FF.pipe(
  RecurringInvoicesDataTableInner,
  withRecurringInvoices(
    ({ recurringInvoicesTableState, recurringInvoicesSelectedRows }) => ({
      recurringInvoicesTableState,
      recurringInvoicesSelectedRows,
    }),
  ),
  withRecurringInvoicesActions,
  withDrawerActions,
);

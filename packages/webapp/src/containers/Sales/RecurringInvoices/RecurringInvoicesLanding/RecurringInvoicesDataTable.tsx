import { Alert, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React, { useCallback, useState } from 'react';
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
import { useMemorizedColumnsWidths } from '@/hooks';
import {
  useDeleteRecurringInvoice,
  useGenerateRecurringInvoiceNow,
  usePauseRecurringInvoice,
  useResumeRecurringInvoice,
} from '@/hooks/query';

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

  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.RECURRING_INVOICES);

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
      setRecurringInvoicesTableState({ pageIndex, pageSize, sortBy });
    },
    [setRecurringInvoicesTableState],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedFlatRows: Array<{ original: RecurringInvoiceTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setRecurringInvoicesSelectedRows(selectedIds);
    },
    [setRecurringInvoicesSelectedRows],
  );

  const handleCellClick = (cell: any) => {
    openDrawer(DRAWERS.RECURRING_INVOICE_DETAILS, {
      recurringInvoiceId: cell.row.original.id,
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
        data={recurringInvoices ?? []}
        loading={isRecurringInvoicesLoading}
        headerLoading={isRecurringInvoicesLoading}
        progressBarLoading={isRecurringInvoicesFetching}
        onFetchData={handleFetchData}
        onSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsIds={recurringInvoicesSelectedRows}
        autoResetSelectedRows={false}
        noInitialFetch={true}
        manualSortBy={true}
        selectionColumn={true}
        sticky={true}
        pagination={true}
        initialPageSize={recurringInvoicesTableState?.pageSize ?? 20}
        manualPagination={true}
        rowsCount={pagination?.total ?? 0}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        rowTestId={'recurring-invoice-row'}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={invoicesSettings?.tableSize as string | undefined}
        payload={{
          onEdit: handleEdit,
          onViewDetails: handleViewDetails,
          onViewInvoices: handleViewInvoices,
          onPause: handlePause,
          onResume: handleResume,
          onGenerate: handleGenerate,
          onDelete: (row: RecurringInvoiceTableRow) => setDeleteTarget(row),
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
        <p>{intl.get('recurring_invoice.delete_confirmation')}</p>
      </Alert>
    </DashboardContentTable>
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

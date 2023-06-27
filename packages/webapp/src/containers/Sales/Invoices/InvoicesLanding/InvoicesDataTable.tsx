// @ts-nocheck
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import InvoicesEmptyStatus from './InvoicesEmptyStatus';

import { TABLES } from '@/constants/tables';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonHeader,
  TableSkeletonRows,
} from '@/components';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withSettings from '@/containers/Settings/withSettings';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useInvoicesTableColumns, ActionsMenu } from './components';
import { useInvoicesListContext } from './InvoicesListProvider';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Invoices datatable.
 */
function InvoicesDataTable({
  // #withInvoicesActions
  setInvoicesTableState,

  // #withInvoices
  invoicesTableState,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogAction
  openDialog,

  // #withSettings
  invoicesTableSize,
}) {
  const history = useHistory();

  // Invoices list context.
  const {
    invoices,
    pagination,
    isEmptyStatus,
    isInvoicesLoading,
    isInvoicesFetching,
  } = useInvoicesListContext();

  // Invoices table columns.
  const columns = useInvoicesTableColumns();

  // Handle delete sale invoice.
  const handleDeleteInvoice = ({ id }) => {
    openAlert('invoice-delete', { invoiceId: id });
  };

  // Handle cancel/confirm invoice deliver.
  const handleDeliverInvoice = ({ id }) => {
    openAlert('invoice-deliver', { invoiceId: id });
  };

  // Handle edit sale invoice.
  const handleEditInvoice = (invoice) => {
    history.push(`/invoices/${invoice.id}/edit`);
  };

  // Handle convert to credit note.
  const handleConvertToCreditNote = ({ id }) => {
    history.push(`/credit-notes/new?from_invoice_id=${id}`, { invoiceId: id });
  };

  // handle quick payment receive.
  const handleQuickPaymentReceive = ({ id }) => {
    openDialog('quick-payment-receive', { invoiceId: id });
  };

  // Handle view detail invoice.
  const handleViewDetailInvoice = ({ id }) => {
    openDrawer(DRAWERS.INVOICE_DETAILS, { invoiceId: id });
  };

  // Handle print invoices.
  const handlePrintInvoice = ({ id }) => {
    openDialog('invoice-pdf-preview', { invoiceId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer(DRAWERS.INVOICE_DETAILS, { invoiceId: cell.row.original.id });
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.INVOICES);

  // Handles fetch data once the table state change.
  const handleDataTableFetchData = useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setInvoicesTableState({
        pageSize,
        pageIndex,
        sortBy,
      });
    },
    [setInvoicesTableState],
  );

  // Display invoice empty status instead of the table.
  if (isEmptyStatus) {
    return <InvoicesEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={invoices}
        loading={isInvoicesLoading}
        headerLoading={isInvoicesLoading}
        progressBarLoading={isInvoicesFetching}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        manualPagination={true}
        pagesCount={pagination.pagesCount}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={invoicesTableSize}
        payload={{
          onDelete: handleDeleteInvoice,
          onDeliver: handleDeliverInvoice,
          onEdit: handleEditInvoice,
          onQuick: handleQuickPaymentReceive,
          onViewDetails: handleViewDetailInvoice,
          onPrint: handlePrintInvoice,
          onConvert: handleConvertToCreditNote,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withDashboardActions,
  withInvoiceActions,
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
  withInvoices(({ invoicesTableState }) => ({ invoicesTableState })),
  withSettings(({ invoiceSettings }) => ({
    invoicesTableSize: invoiceSettings?.tableSize,
  })),
)(InvoicesDataTable);

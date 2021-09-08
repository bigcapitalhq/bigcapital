import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import InvoicesEmptyStatus from './InvoicesEmptyStatus';

import { compose } from 'utils';
import { DataTable, DashboardContentTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withSettings from 'containers/Settings/withSettings';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { useInvoicesTableColumns, ActionsMenu } from './components';
import { useInvoicesListContext } from './InvoicesListProvider';

/**
 * Invoices datatable.
 */
function InvoicesDataTable({
  // #withInvoicesActions
  setInvoicesTableState,

  // #withInvoices
  invoicesTableState,

  // #withSettings
  baseCurrency,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogAction
  openDialog,
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

  // Handle drawer invoice.
  const handleDrawerInvoice = ({ id }) => {
    openDrawer('invoice-drawer', { invoiceId: id });
  };

  // handle quick payment receive.
  const handleQuickPaymentReceive = ({ id }) => {
    openDialog('quick-payment-receive', { invoiceId: id });
  };

  // Handle view detail invoice.
  const handleViewDetailInvoice = ({ id }) => {
    openDrawer('invoice-detail-drawer', { invoiceId: id });
  };

  // Handle print invoices.
  const handlePrintInvoice = ({ id }) => {
    openDialog('invoice-pdf-preview', { invoiceId: id });
  };

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
        initialState={invoicesTableState}
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
        payload={{
          onDelete: handleDeleteInvoice,
          onDeliver: handleDeliverInvoice,
          onEdit: handleEditInvoice,
          onDrawer: handleDrawerInvoice,
          onQuick: handleQuickPaymentReceive,
          onViewDetails: handleViewDetailInvoice,
          onPrint: handlePrintInvoice,
          baseCurrency,
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
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(InvoicesDataTable);

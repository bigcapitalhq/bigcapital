import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import InvoicesEmptyStatus from './InvoicesEmptyStatus';

import { compose } from 'utils';
import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withInvoices from './withInvoices'; 
import withInvoiceActions from './withInvoiceActions';
import withSettings from 'containers/Settings/withSettings';
import withAlertsActions from 'containers/Alert/withAlertActions';

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
        baseCurrency,
      }}
    />
  );
}

export default compose(
  withDashboardActions,
  withInvoiceActions,
  withAlertsActions,
  withInvoices(({ invoicesTableState }) => ({ invoicesTableState })),
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(InvoicesDataTable);

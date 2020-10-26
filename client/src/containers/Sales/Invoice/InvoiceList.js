import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery, queryCache } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import InvoicesDataTable from './InvoicesDataTable';
import InvoiceActionsBar from './InvoiceActionsBar';
import InvoiceViewTabs from './InvoiceViewTabs';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withViewsActions from 'containers/Views/withViewsActions';

import { compose } from 'utils';

function InvoiceList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  //#withInvoice
  invoicesTableQuery,
  invoicesViews,

  //#withInvoiceActions
  requestFetchInvoiceTable,
  requestDeleteInvoice,
  addInvoiceTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deleteInvoice, setDeleteInvoice] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'invoice_list' }));
  }, [changePageTitle, formatMessage]);

  // const fetchResourceViews = useQuery(
  //   ['resource-views', 'sales_invoices'],
  //   (key, resourceName) => requestFetchResourceViews(resourceName),
  // );

  // const fetchResourceFields = useQuery(
  //   ['resource-fields', 'sales_invoices'],
  //   (key, resourceName) => requestFetchResourceFields(resourceName),
  // );

  const fetchInvoices = useQuery(['invoices-table', invoicesTableQuery], () =>
    requestFetchInvoiceTable(),
  );
  //handle dalete Invoice
  const handleDeleteInvoice = useCallback(
    (invoice) => {
      setDeleteInvoice(invoice);
    },
    [setDeleteInvoice],
  );

  // handle cancel Invoice
  const handleCancelInvoiceDelete = useCallback(() => {
    setDeleteInvoice(false);
  }, [setDeleteInvoice]);

  // handleConfirm delete invoice
  const handleConfirmInvoiceDelete = useCallback(() => {
    requestDeleteInvoice(deleteInvoice.id).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_invocie_has_been_successfully_deleted',
        }),
        intent: Intent.SUCCESS,
      });
      setDeleteInvoice(false);
    });
  }, [deleteInvoice, requestDeleteInvoice, formatMessage]);

  const handleEditInvoice = useCallback((invoice) => {
    history.push(`/invoices/${invoice.id}/edit`);
  });

  // Calculates the selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      const page = pageIndex + 1;

      addInvoiceTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
        page_size: pageSize,
        page,
      });
    },
    [addInvoiceTableQueries],
  );

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, [fetchInvoices]);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (_invoices) => {
      setSelectedRows(_invoices);
    },
    [setSelectedRows],
  );
  return (
    <DashboardInsider
      // loading={fetchResourceViews.isFetching || fetchResourceFields.isFetching}
      name={'sales_invoices'}
    >
      <InvoiceActionsBar
        // onBulkDelete={}
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
      />
      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={['/invoices/:custom_view_id/custom_view', '/invoices']}
          >
            <InvoiceViewTabs />
            <InvoicesDataTable
              loading={fetchInvoices.isFetching}
              onDeleteInvoice={handleDeleteInvoice}
              onFetchData={handleFetchData}
              onEditInvoice={handleEditInvoice}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon={'trash'}
          intent={Intent.DANGER}
          isOpen={deleteInvoice}
          onCancel={handleCancelInvoiceDelete}
          onConfirm={handleConfirmInvoiceDelete}
        >
          <p>
            <T id={'once_delete_this_invoice_you_will_able_to_restore_it'} />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withInvoiceActions,
  withDashboardActions,
  withViewsActions,
  withInvoices(({ invoicesTableQuery }) => ({
    invoicesTableQuery,
  })),
)(InvoiceList);

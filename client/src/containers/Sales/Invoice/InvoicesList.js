import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery} from 'react-query';

import 'style/pages/SaleInvoice/List.scss';

import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import InvoicesDataTable from './InvoicesDataTable';
import InvoiceActionsBar from './InvoiceActionsBar';
import InvoiceViewTabs from './InvoiceViewTabs';
import InvoicesAlerts from './InvoicesAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withInvoices from './withInvoices';
import withInvoiceActions from 'containers/Sales/Invoice/withInvoiceActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Invoices list.
 */
function InvoicesList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  //#withInvoice
  invoicesTableQuery,
  invoicesViews,

  // #withAlertsActions.
  openAlert,

  //#withInvoiceActions
  requestFetchInvoiceTable,
  
  addInvoiceTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
   const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'invoices_list' }));
  }, [changePageTitle, formatMessage]);

  const fetchResourceViews = useQuery(
    ['resource-views', 'sale_invoice'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  const fetchResourceFields = useQuery(
    ['resource-fields', 'sale_invoice'],
    (key, resourceName) => requestFetchResourceFields(resourceName),
  );

  const fetchInvoices = useQuery(
    ['invoices-table', invoicesTableQuery],
    (key, query) => requestFetchInvoiceTable({ ...query }),
  );
  //handle delete Invoice
  const handleDeleteInvoice = useCallback(
    ({ id }) => {
      openAlert('invoice-delete', { invoiceId: id });
    },
    [openAlert],
  );

  // Handle cancel/confirm invoice deliver.
  const handleDeliverInvoice = useCallback(
    ({id}) => {
      openAlert('invoice-deliver', { invoiceId: id });
    },
    [openAlert],
  );


  const handleEditInvoice = useCallback((invoice) => {
    history.push(`/invoices/${invoice.id}/edit`);
  });

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, []);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (_invoices) => {
      setSelectedRows(_invoices);
    },
    [setSelectedRows],
  );
  return (
    <DashboardInsider
      loading={fetchResourceViews.isFetching || fetchResourceFields.isFetching}
      name={'sales-invoices-list'}
    >
      <InvoiceActionsBar
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
              onDeleteInvoice={handleDeleteInvoice}
              onEditInvoice={handleEditInvoice}
              onDeliverInvoice={handleDeliverInvoice}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>

        <InvoicesAlerts />
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
  withAlertsActions,
)(InvoicesList);

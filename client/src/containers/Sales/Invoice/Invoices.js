import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import InvoiceForm from './InvoiceForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withInvoiceActions from './withInvoiceActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';

import { compose } from 'utils';

function Invoices({
  // #withCustomersActions
  requestFetchCustomers,

  // #withItemsActions
  requestFetchItems,

  // #withInvoiceActions
  requsetFetchInvoice,

  // #withSettingsActions
  requestFetchOptions,
}) {
  const history = useHistory();
  const { id } = useParams();

  const fetchInvoice = useQuery(
    ['invoice', id],
    (key, _id) => requsetFetchInvoice(_id),
    { enabled: !!id },
  );

  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  // Handle fetch Items data table or list
  const fetchItems = useQuery('items-table', () => requestFetchItems({}));

  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/invoices');
    },
    [history],
  );
  // Handle fetch customers data table or list
  const fetchCustomers = useQuery('customers-table', () =>
    requestFetchCustomers({}),
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={
        fetchCustomers.isFetching ||
        fetchItems.isFetching ||
        fetchInvoice.isFetching
      }
      name={'invoice-form'}
    >
      <InvoiceForm
        onFormSubmit={handleFormSubmit}
        invoiceId={id}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(
  withInvoiceActions,
  withCustomersActions,
  withItemsActions,
  withSettingsActions,
)(Invoices);

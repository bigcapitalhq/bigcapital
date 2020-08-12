import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import InvoiceForm from './InvoiceForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withInvoiceActions from './withInvoiceActions';

import { compose } from 'utils';

function Invoices({
  requestFetchCustomers,
  requestFetchItems,
  requsetFetchInvoice,
}) {
  const history = useHistory();
  const { id } = useParams();

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

  const fetchInvoice = useQuery(
    ['invoice', id],
    (key, _id) => requsetFetchInvoice(_id),
    { enabled: !!id },
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
)(Invoices);

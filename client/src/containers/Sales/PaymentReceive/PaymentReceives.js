import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import PaymentReceiveForm from './PaymentReceiveForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withInvoiceActions from '../Invoice/withInvoiceActions';
import withInvoices from '../Invoice/withInvoices';

import { compose } from 'utils';

function PaymentReceives({
  //#withwithAccountsActions
  requestFetchAccounts,

  //#withCustomersActions
  requestFetchCustomers,

  //#withItemsActions
  requestFetchItems,

  //#withPaymentReceivesActions
  requestFetchPaymentReceive,

  //#withInvoicesActions
  requestFetchDueInvoices,
}) {
  const history = useHistory();
  const { id } = useParams();
  const [customerId, setCustomerId] = useState(null);
  const [payload, setPayload] = useState(false);

  // Handle fetch accounts data
  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  // Handle fetch Items data table or list
  const fetchItems = useQuery('items-list', () => requestFetchItems({}));

  // Handle fetch customers data table or list
  const fetchCustomers = useQuery('customers-list', () =>
    requestFetchCustomers({}),
  );

  const fetchPaymentReceive = useQuery(
    ['payment-receive', id],
    (key, _id) => requestFetchPaymentReceive(_id),
    { enabled: !!id },
  );

  const fetchDueInvoices = useQuery(
    ['due-invoies', customerId],
    (key, query) => requestFetchDueInvoices(query),
    { enabled: !!customerId },
  );

  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/payment-receives');
    },
    [history],
  );
  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleCustomerChange = (customerId) => {
    setCustomerId(customerId);
  };

  return (
    <DashboardInsider
      loading={
        fetchCustomers.isFetching ||
        fetchItems.isFetching ||
        fetchAccounts.isFetching ||
        fetchPaymentReceive.isFetching
      }
      name={'payment-receive'}
    >
      <PaymentReceiveForm
        onFormSubmit={handleFormSubmit}
        paymentReceiveId={id}
        onCancelForm={handleCancel}
        onCustomerChange={handleCustomerChange}
      />
    </DashboardInsider>
  );
}

export default compose(
  withCustomersActions,
  withItemsActions,
  withAccountsActions,
  withPaymentReceivesActions,
  withInvoiceActions,
)(PaymentReceives);

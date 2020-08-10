import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import PaymentReceiveForm from './PaymentReceiveForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemsActions from 'containers/Items/withItemsActions';
//#withInvoiceActions

import { compose } from 'utils';

function PaymentReceives({
  //#withwithAccountsActions
  requestFetchAccounts,

  //#withCustomersActions
  requestFetchCustomers,

  //#withItemsActions
  requestFetchItems,

  //#withInvoiceActions
}) {
  const history = useHistory();

  // Handle fetch accounts data
  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  // Handle fetch Items data table or list
  const fetchItems = useQuery('items-table', () => requestFetchItems({}));

  // Handle fetch customers data table or list
  const fetchCustomers = useQuery('customers-table', () =>
    requestFetchCustomers({}),
  );

  const handleFormSubmit = useCallback((payload) => {}, [history]);

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={
        fetchCustomers.isFetching ||
        fetchItems.isFetching ||
        fetchAccounts.isFetching
      }
    >
      <PaymentReceiveForm
        onFormSubmit={handleFormSubmit}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(
  withCustomersActions,
  withItemsActions,
  withAccountsActions,
  // withInvoiceActions
)(PaymentReceives);

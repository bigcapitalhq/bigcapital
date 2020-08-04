import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import ReceiptFrom from './ReceiptForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemsActions from 'containers/Items/withItemsActions';

import { compose } from 'utils';

function Receipts({
  //#withwithAccountsActions
  requestFetchAccounts,

  //#withCustomersActions
  requestFetchCustomers,

  //#withItemsActions
  requestFetchItems,
}) {
  const history = useHistory();
  const { id } = useParams();

  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  const fetchCustomers = useQuery('customers-table', () =>
    requestFetchCustomers({}),
  );

  // Handle fetch Items data table or list
  const fetchItems = useQuery('items-table', () => requestFetchItems({}));

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
      <ReceiptFrom
        onFormSubmit={handleFormSubmit}
        // ReceiptId={id}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(
  withCustomersActions,
  withItemsActions,
  withAccountsActions,
)(Receipts);

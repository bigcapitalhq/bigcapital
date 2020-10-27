import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import ReceiptFrom from './ReceiptForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withReceiptActions from './withReceiptActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';

import { compose } from 'utils';

function Receipts({
  //#withwithAccountsActions
  requestFetchAccounts,

  //#withCustomersActions
  requestFetchCustomers,

  //#withItemsActions
  requestFetchItems,

  //#withReceiptsActions
  requestFetchReceipt,

  // #withSettingsActions
  requestFetchOptions,
}) {
  const history = useHistory();
  const { id } = useParams();

  const fetchReceipt = useQuery(
    ['receipt', id],
    (key, _id) => requestFetchReceipt(_id),
    { enabled: !!id },
  );
  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  const fetchCustomers = useQuery('customers-table', () =>
    requestFetchCustomers({}),
  );

  // Handle fetch Items data table or list
  const fetchItems = useQuery('items-table', () => requestFetchItems({}));

  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/receipts');
    },
    [history],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={
        fetchCustomers.isFetching ||
        fetchItems.isFetching ||
        fetchAccounts.isFetching ||
        fetchReceipt.isFetching
      }
      name={'receipt-form'}
    >
      <ReceiptFrom
        onFormSubmit={handleFormSubmit}
        receiptId={id}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(
  withReceiptActions,
  withCustomersActions,
  withItemsActions,
  withAccountsActions,
  withSettingsActions,
)(Receipts);

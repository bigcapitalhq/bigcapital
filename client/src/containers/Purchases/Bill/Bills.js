import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import BillForm from './BillForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withVendorActions from 'containers/Vendors/withVendorActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withBillActions from './withBillActions';

import { compose } from 'utils';

function Bills({
  //#withwithAccountsActions
  requestFetchAccounts,

  //#withVendorActions
  requestFetchVendorsTable,

  //#withItemsActions
  requestFetchItems,

  //# withBilleActions
  requestFetchBill,
}) {
  const history = useHistory();
  const { id } = useParams();

  // Handle fetch accounts
  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  // Handle fetch customers data table
  const fetchVendors = useQuery('vendors-list', () =>
    requestFetchVendorsTable({}),
  );

  // Handle fetch Items data table or list
  const fetchItems = useQuery('items-list', () => requestFetchItems({}));

  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/bills');
    },
    [history],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const fetchBill = useQuery(
    ['bill', id],
    (key, _id) => requestFetchBill(_id),
    { enabled: !!id },
  );

  return (
    <DashboardInsider
      loading={
        fetchVendors.isFetching ||
        fetchItems.isFetching ||
        fetchAccounts.isFetching ||
        fetchBill.isFetching
      }
      name={'bill-form'}
    >
      <BillForm
        onFormSubmit={handleFormSubmit}
        billId={id}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(
  withBillActions,
  withVendorActions,
  withItemsActions,
  withAccountsActions,
)(Bills);

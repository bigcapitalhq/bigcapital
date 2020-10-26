import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import PaymentMadeForm from './PaymentMadeForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withVenderActions from 'containers/Vendors/withVendorActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withPaymentMadeActions from './withPaymentMadeActions';
import withBillActions from '../Bill/withBillActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';

import { compose } from 'utils';

function PaymentMade({
  //#withwithAccountsActions
  requestFetchAccounts,

  //#withVenderActions
  requestFetchVendorsTable,

  //#withItemsActions
  requestFetchItems,

  //#withPaymentMadesActions
  requestFetchPaymentMade,

  //#withBillActions

  // #withSettingsActions
  requestFetchOptions,
}) {
  const history = useHistory();
  const { id } = useParams();
  const [venderId, setVenderId] = useState(null);

  // Handle fetch accounts data
  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  // Handle fetch Items data table or list
  const fetchItems = useQuery('items-list', () => requestFetchItems({}));

  // Handle fetch venders data table or list
  const fetchVenders = useQuery('venders-list', () =>
    requestFetchVendorsTable({}),
  );

  const fetchPaymentMade = useQuery(
    ['payment-made', id],
    (key, _id) => requestFetchPaymentMade(_id),
    { enabled: !!id },
  );

  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/payment-mades');
    },
    [history],
  );
  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleVenderChange = (venderId) => {
    setVenderId(venderId);
  };
  return (
    <DashboardInsider
      loading={
        fetchVenders.isFetching ||
        fetchItems.isFetching ||
        fetchAccounts.isFetching ||
        fetchPaymentMade.isFetching
      }
      name={'payment-made'}
    >
      <PaymentMadeForm
        onFormSubmit={handleFormSubmit}
        paymentMadeId={id}
        onCancelForm={handleCancel}
        onVenderChange={handleVenderChange}
      />
    </DashboardInsider>
  );
}

export default compose(
  withVenderActions,
  withItemsActions,
  withAccountsActions,
  withBillActions,
  withPaymentMadeActions,
  withSettingsActions
)(PaymentMade);

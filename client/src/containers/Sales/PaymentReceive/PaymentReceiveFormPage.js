import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import DashboardInsider from 'components/Dashboard/DashboardInsider';

import PaymentReceiveForm from './PaymentReceiveForm';
import withDashboardActions from "containers/Dashboard/withDashboardActions";
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withCustomersActions from 'containers/Customers/withCustomersActions';

import { compose } from 'utils';

/**
 * Payment receive form page.
 */
function PaymentReceiveFormPage({

  // #withDashboardAction
  changePageTitle,

  // #withAccountsActions
  requestFetchAccounts,

  // #withSettingsActions
  requestFetchOptions,

  // #withPaymentReceivesActions
  requestFetchPaymentReceive,

  // #withCustomersActions
  requestFetchCustomers,

  // #withDashboardActions
  setSidebarShrink,
  resetSidebarPreviousExpand,
}) {
  const { id: paymentReceiveId } = useParams();

  useEffect(() => {
    // Shrink the sidebar by foce.
    setSidebarShrink();

    return () => {
      // Reset the sidebar to the previous status.
      resetSidebarPreviousExpand();
    };
  }, [resetSidebarPreviousExpand, setSidebarShrink]);

  // Fetches payment recevie details.
  const fetchPaymentReceive = useQuery(
    ['payment-receive', paymentReceiveId],
    (key, _id) => requestFetchPaymentReceive(_id),
    { enabled: paymentReceiveId },
  )

  // Handle fetch accounts data.
  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  // Fetch payment made settings.
  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  // Fetches customers list.
  const fetchCustomers = useQuery(
    ['customers-list'], () => requestFetchCustomers(),
  );

  return (
    <DashboardInsider
      loading={
        fetchPaymentReceive.isFetching ||
        fetchAccounts.isFetching ||
        // fetchSettings.isFetching || 
        fetchCustomers.isFetching
      }
      name={'payment-receive-form'}
    >
      <PaymentReceiveForm
        paymentReceiveId={paymentReceiveId}
      />
    </DashboardInsider>
  )
}

export default compose(
  withDashboardActions,
  withAccountsActions,
  withSettingsActions,
  withPaymentReceivesActions,
  withCustomersActions,
)(PaymentReceiveFormPage);
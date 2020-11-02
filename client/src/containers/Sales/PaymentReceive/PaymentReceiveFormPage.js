import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { DashboardInsider } from 'components'

// import PaymentReceiveForm from './PaymentReceiveForm';
import withDashboardActions from "containers/Dashboard/withDashboardActions";
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withPaymentReceivesActions from './withPaymentReceivesActions';

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
  requestFetchPaymentReceive

  // #withCustomersActions
  requestFetchCustomers
}) {
  const { id: paymentReceiveId } = useParams();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (paymentReceiveId) {
      changePageTitle(formatMessage({ id: 'edit_payment_receive' }));
    } else {
      changePageTitle(formatMessage({ id: 'payment_receive' }));
    }
  }, [changePageTitle, paymentReceiveId, formatMessage]);

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
        fetchSettings.isFetching || 
        fetchCustomers.isFetching
      }>
      {/* <PaymentReceiveForm
        paymentReceiveId={paymentReceiveId}
      /> */}
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
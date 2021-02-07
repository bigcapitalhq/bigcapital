import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import PaymentReceiveActionsBar from './PaymentReceiveActionsBar';
import PaymentReceiveAlerts from './PaymentReceiveAlerts';
import { PaymentReceivesListProvider } from './PaymentReceiptsListProvider';
import PaymentReceivesViewPage from './PaymentReceivesViewPage';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withPaymentReceives from './withPaymentReceives';

import { compose } from 'utils';

/**
 * Payment receives list.
 */
function PaymentReceiveList({
  // #withDashboardActions
  changePageTitle,

  // #withPaymentReceives
  paymentReceivesTableQuery,
}) {
  const { formatMessage } = useIntl();
  
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'payment_Receives_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <PaymentReceivesListProvider query={paymentReceivesTableQuery}>
      <PaymentReceiveActionsBar />

      <DashboardPageContent>
        <PaymentReceivesViewPage />
        <PaymentReceiveAlerts />
      </DashboardPageContent>
    </PaymentReceivesListProvider>
  );
}

export default compose(
  withDashboardActions,
  withPaymentReceives(({ paymentReceivesTableQuery }) => ({
    paymentReceivesTableQuery,
  })),
)(PaymentReceiveList);

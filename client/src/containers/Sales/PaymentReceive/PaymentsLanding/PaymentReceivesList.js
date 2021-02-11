import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import PaymentReceiveActionsBar from './PaymentReceiveActionsBar';
import PaymentReceiveAlerts from '../PaymentReceiveAlerts';
import { PaymentReceivesListProvider } from './PaymentReceiptsListProvider';
import PaymentReceiveViewTabs from './PaymentReceiveViewTabs';
import PaymentReceivesTable from './PaymentReceivesTable';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withPaymentReceives from './withPaymentReceives';

import { compose, transformTableStateToQuery } from 'utils';

/**
 * Payment receives list.
 */
function PaymentReceiveList({
  // #withDashboardActions
  changePageTitle,

  // #withPaymentReceives
  paymentReceivesTableState,
}) {
  const { formatMessage } = useIntl();

  // Changes the dashboard page title once the page mount.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'payment_Receives_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <PaymentReceivesListProvider
      query={transformTableStateToQuery(paymentReceivesTableState)}
    >
      <PaymentReceiveActionsBar />

      <DashboardPageContent>
        <PaymentReceiveViewTabs />
        <PaymentReceivesTable />
      </DashboardPageContent>

      <PaymentReceiveAlerts />
    </PaymentReceivesListProvider>
  );
}

export default compose(
  withDashboardActions,
  withPaymentReceives(({ paymentReceivesTableState }) => ({
    paymentReceivesTableState,
  })),
)(PaymentReceiveList);

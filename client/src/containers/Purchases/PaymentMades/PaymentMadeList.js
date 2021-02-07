import React, { useEffect } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import PaymentMadeActionsBar from './PaymentMadeActionsBar';
import PaymentMadesAlerts from './PaymentMadesAlerts';
import { PaymentMadesListProvider } from './PaymentMadesListProvider';
import PaymentMadesView from './PaymentMadesView';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withPaymentMades from './withPaymentMade';

import { compose } from 'utils';

/**
 * Payment mades list.
 */
function PaymentMadeList({
  // #withDashboardActions
  changePageTitle,

  // #withPaymentMades
  paymentMadeTableQuery,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'payment_made_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <PaymentMadesListProvider query={paymentMadeTableQuery}>
      <PaymentMadeActionsBar />

      <DashboardPageContent>
        <PaymentMadesView />
        <PaymentMadesAlerts />
      </DashboardPageContent>
    </PaymentMadesListProvider>
  );
}

export default compose(
  withDashboardActions,
  withPaymentMades(({ paymentMadeTableQuery }) => ({
    paymentMadeTableQuery,
  })),
)(PaymentMadeList);

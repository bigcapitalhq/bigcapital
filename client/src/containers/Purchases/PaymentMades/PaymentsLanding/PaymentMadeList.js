import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import PaymentMadeActionsBar from './PaymentMadeActionsBar';
import PaymentMadesAlerts from '../PaymentMadesAlerts';
import PaymentMadesTable from './PaymentMadesTable';
import { PaymentMadesListProvider } from './PaymentMadesListProvider';
import PaymentMadeViewTabs from './PaymentMadeViewTabs';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withPaymentMades from './withPaymentMade';

import { compose, transformTableStateToQuery } from 'utils';

/**
 * Payment mades list.
 */
function PaymentMadeList({
  // #withDashboardActions
  changePageTitle,

  // #withPaymentMades
  paymentMadesTableState,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'payment_made_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <PaymentMadesListProvider
      query={transformTableStateToQuery(paymentMadesTableState)}
    >
      <PaymentMadeActionsBar />

      <DashboardPageContent>
        <PaymentMadeViewTabs />
        <PaymentMadesTable />
      </DashboardPageContent>

      <PaymentMadesAlerts />
    </PaymentMadesListProvider>
  );
}

export default compose(
  withDashboardActions,
  withPaymentMades(({ paymentMadesTableState }) => ({
    paymentMadesTableState,
  })),
)(PaymentMadeList);

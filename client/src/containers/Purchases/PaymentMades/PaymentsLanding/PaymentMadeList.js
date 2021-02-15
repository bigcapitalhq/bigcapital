import React from 'react';
import { DashboardContentTable, DashboardPageContent } from 'components';
import PaymentMadeActionsBar from './PaymentMadeActionsBar';
import PaymentMadesAlerts from '../PaymentMadesAlerts';
import PaymentMadesTable from './PaymentMadesTable';
import { PaymentMadesListProvider } from './PaymentMadesListProvider';
import PaymentMadeViewTabs from './PaymentMadeViewTabs';

import withPaymentMades from './withPaymentMade';

import { compose, transformTableStateToQuery } from 'utils';

/**
 * Payment mades list.
 */
function PaymentMadeList({
  // #withPaymentMades
  paymentMadesTableState,
}) {
  return (
    <PaymentMadesListProvider
      query={transformTableStateToQuery(paymentMadesTableState)}
    >
      <PaymentMadeActionsBar />

      <DashboardPageContent>
        <PaymentMadeViewTabs />

        <DashboardContentTable>
          <PaymentMadesTable />
        </DashboardContentTable>
      </DashboardPageContent>

      <PaymentMadesAlerts />
    </PaymentMadesListProvider>
  );
}

export default compose(
  withPaymentMades(({ paymentMadesTableState }) => ({
    paymentMadesTableState,
  })),
)(PaymentMadeList);

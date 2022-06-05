import React from 'react';

import 'style/pages/PaymentMade/List.scss';

import { DashboardPageContent } from 'components';
import PaymentMadeActionsBar from './PaymentMadeActionsBar';
import PaymentMadesTable from './PaymentMadesTable';
import { PaymentMadesListProvider } from './PaymentMadesListProvider';
import PaymentMadeViewTabs from './PaymentMadeViewTabs';

import withPaymentMades from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';

import { compose, transformTableStateToQuery } from 'utils';

/**
 * Payment mades list.
 */
function PaymentMadeList({
  // #withPaymentMades
  paymentMadesTableState,
  paymentsTableStateChanged,

  // #withPaymentMadeActions
  resetPaymentMadesTableState,
}) {
  // Resets the invoices table state once the page unmount.
  React.useEffect(
    () => () => {
      resetPaymentMadesTableState();
    },
    [resetPaymentMadesTableState],
  );

  return (
    <PaymentMadesListProvider
      query={transformTableStateToQuery(paymentMadesTableState)}
      tableStateChanged={paymentsTableStateChanged}
    >
      <PaymentMadeActionsBar />

      <DashboardPageContent>
        <PaymentMadeViewTabs />
        <PaymentMadesTable />
      </DashboardPageContent>
    </PaymentMadesListProvider>
  );
}

export default compose(
  withPaymentMades(({ paymentMadesTableState, paymentsTableStateChanged }) => ({
    paymentMadesTableState,
    paymentsTableStateChanged,
  })),
  withPaymentMadeActions,
)(PaymentMadeList);

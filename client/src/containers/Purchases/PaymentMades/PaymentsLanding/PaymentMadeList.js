import React from 'react';

import 'style/pages/PaymentMade/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';
import PaymentMadeActionsBar from './PaymentMadeActionsBar';
import PaymentMadesAlerts from '../PaymentMadesAlerts';
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

  // #withPaymentMadeActions
  setPaymentMadesTableState
}) {
  // Resets the invoices table state once the page unmount.
  React.useEffect(
    () => () => {
      setPaymentMadesTableState({
        filterRoles: [],
        viewSlug: '',
        pageIndex: 0,
      });
    },
    [setPaymentMadesTableState],
  );

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
  withPaymentMadeActions
)(PaymentMadeList);

// @ts-nocheck
import React from 'react';

import '@/style/pages/PaymentMade/List.scss';

import { DashboardPageContent } from '@/components';
import { PaymentMadesListProvider } from './PaymentMadesListProvider';
import { PaymentMadeActionsBar } from './PaymentMadeActionsBar';
import { PaymentMadesTable } from './PaymentMadesTable';

import { withPaymentMade } from './withPaymentMade';
import { withPaymentMadeActions } from './withPaymentMadeActions';

import { transformTableStateToQuery } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Payment mades list.
 */
function PaymentMadeListInner({
  // #withPaymentMade
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
        <PaymentMadesTable />
      </DashboardPageContent>
    </PaymentMadesListProvider>
  );
}

export const PaymentMadeList = flow(
  withPaymentMadeActions,
  withPaymentMade(({ paymentMadesTableState, paymentsTableStateChanged }) => ({
    paymentMadesTableState,
    paymentsTableStateChanged,
  })),
)(PaymentMadeListInner);

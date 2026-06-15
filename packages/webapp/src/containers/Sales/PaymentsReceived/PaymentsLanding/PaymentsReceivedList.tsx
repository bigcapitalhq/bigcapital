// @ts-nocheck
import React from 'react';

import '@/style/pages/PaymentReceive/List.scss';

import { DashboardPageContent } from '@/components';
import { PaymentsReceivedListProvider } from './PaymentsReceivedListProvider';
import { PaymentsReceivedTable as PaymentReceivesTable } from './PaymentsReceivedTable';
import { PaymentsReceivedActionsBar } from './PaymentsReceivedActionsBar';

import { withPaymentsReceived } from './withPaymentsReceived';
import { withPaymentsReceivedActions } from './withPaymentsReceivedActions';

import { transformTableStateToQuery } from '@/utils';
import { flow } from 'fp-ts/function';

function PaymentsReceivedListInner({
  // #withPaymentsReceived
  paymentReceivesTableState,
  paymentsTableStateChanged,

  // #withPaymentsReceivedActions
  resetPaymentReceivesTableState,
}) {
  // Resets the payment receives table state once the page unmount.
  React.useEffect(
    () => () => {
      resetPaymentReceivesTableState();
    },
    [resetPaymentReceivesTableState],
  );

  return (
    <PaymentsReceivedListProvider
      query={transformTableStateToQuery(paymentReceivesTableState)}
      tableStateChanged={paymentsTableStateChanged}
    >
      <PaymentsReceivedActionsBar />

      <DashboardPageContent>
        <PaymentReceivesTable />
      </DashboardPageContent>
    </PaymentsReceivedListProvider>
  );
}

export const PaymentsReceivedList = flow(
  withPaymentsReceivedActions,
  withPaymentsReceived(
    ({ paymentReceivesTableState, paymentsTableStateChanged }) => ({
      paymentReceivesTableState,
      paymentsTableStateChanged,
    }),
  ),
)(PaymentsReceivedListInner);

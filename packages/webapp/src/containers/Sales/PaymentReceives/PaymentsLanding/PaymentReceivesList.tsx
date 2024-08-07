// @ts-nocheck
import React from 'react';

import '@/style/pages/PaymentReceive/List.scss';

import { DashboardPageContent } from '@/components';
import { PaymentReceivesListProvider } from './PaymentReceiptsListProvider';
import PaymentReceivesTable from './PaymentReceivesTable';
import PaymentReceiveActionsBar from './PaymentReceiveActionsBar';

import withPaymentReceives from './withPaymentReceives';
import withPaymentReceivesActions from './withPaymentReceivesActions';

import { compose, transformTableStateToQuery } from '@/utils';

/**
 * Payment receives list.
 */
function PaymentReceiveList({
  // #withPaymentReceives
  paymentReceivesTableState,
  paymentsTableStateChanged,

  // #withPaymentReceivesActions
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
    <PaymentReceivesListProvider
      query={transformTableStateToQuery(paymentReceivesTableState)}
      tableStateChanged={paymentsTableStateChanged}
    >
      <PaymentReceiveActionsBar />

      <DashboardPageContent>
        <PaymentReceivesTable />
      </DashboardPageContent>
    </PaymentReceivesListProvider>
  );
}

export default compose(
  withPaymentReceives(
    ({ paymentReceivesTableState, paymentsTableStateChanged }) => ({
      paymentReceivesTableState,
      paymentsTableStateChanged,
    }),
  ),
  withPaymentReceivesActions,
)(PaymentReceiveList);

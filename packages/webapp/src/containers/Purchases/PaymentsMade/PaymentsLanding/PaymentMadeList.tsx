// @ts-nocheck
import React from 'react';

import '@/style/pages/PaymentMade/List.scss';

import { DashboardPageContent } from '@/components';
import { PaymentsMadeListProvider } from './PaymentsMadeListProvider';
import PaymentMadeActionsBar from './PaymentMadeActionsBar';
import PaymentsMadeTable from './PaymentsMadeTable';
import PaymentMadeViewTabs from './PaymentMadeViewTabs';

import withPaymentsMade from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';

import { compose, transformTableStateToQuery } from '@/utils';

/**
 * Payments made list.
 */
function PaymentMadeList({
  // #withPaymentsMade
  paymentsMadeTableState,
  paymentsTableStateChanged,

  // #withPaymentMadeActions
  resetPaymentsMadeTableState,
}) {
  // Resets the invoices table state once the page unmount.
  React.useEffect(
    () => () => {
      resetPaymentsMadeTableState();
    },
    [resetPaymentsMadeTableState],
  );

  return (
    <PaymentsMadeListProvider
      query={transformTableStateToQuery(paymentsMadeTableState)}
      tableStateChanged={paymentsTableStateChanged}
    >
      <PaymentMadeActionsBar />

      <DashboardPageContent>
        <PaymentMadeViewTabs />
        <PaymentsMadeTable />
      </DashboardPageContent>
    </PaymentsMadeListProvider>
  );
}

export default compose(
  withPaymentsMade(({ paymentsMadeTableState, paymentsTableStateChanged }) => ({
    paymentsMadeTableState,
    paymentsTableStateChanged,
  })),
  withPaymentMadeActions,
)(PaymentMadeList);

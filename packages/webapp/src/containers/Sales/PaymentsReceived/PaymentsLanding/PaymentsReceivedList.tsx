import React from 'react';

import '@/style/pages/PaymentReceive/List.scss';
import { PaymentsReceivedActionsBar } from './PaymentsReceivedActionsBar';
import { PaymentsReceivedListDialogs } from './PaymentsReceivedListDialogs';
import { PaymentsReceivedListDrawers } from './PaymentsReceivedListDrawers';
import { PaymentsReceivedListProvider } from './PaymentsReceivedListProvider';
import { PaymentsReceivedTable as PaymentReceivesTable } from './PaymentsReceivedTable';
import { withPaymentsReceived } from './withPaymentsReceived';
import { withPaymentsReceivedActions } from './withPaymentsReceivedActions';
import type { WithPaymentsReceivedProps } from './withPaymentsReceived';
import { DashboardPageContent } from '@/components';
import { compose, transformTableStateToQuery } from '@/utils';

interface WithPaymentsReceivedActionsProps {
  resetPaymentReceivesTableState: () => void;
}

interface PaymentsReceivedListProps
  extends Pick<
      WithPaymentsReceivedProps,
      'paymentReceivesTableState' | 'paymentsTableStateChanged'
    >,
    WithPaymentsReceivedActionsProps {}

function PaymentsReceivedListInner({
  paymentReceivesTableState,
  paymentsTableStateChanged,
  resetPaymentReceivesTableState,
}: PaymentsReceivedListProps) {
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
      <PaymentsReceivedListDrawers />
      <PaymentsReceivedListDialogs />

      <DashboardPageContent>
        <PaymentReceivesTable />
      </DashboardPageContent>
    </PaymentsReceivedListProvider>
  );
}

export const PaymentsReceivedList = compose(
  withPaymentsReceived(
    ({ paymentReceivesTableState, paymentsTableStateChanged }) => ({
      paymentReceivesTableState,
      paymentsTableStateChanged,
    }),
  ),
  withPaymentsReceivedActions,
)(PaymentsReceivedListInner);

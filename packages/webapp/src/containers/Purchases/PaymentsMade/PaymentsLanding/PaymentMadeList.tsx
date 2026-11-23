import * as FF from 'fp-ts/function';
import React from 'react';
import { PaymentMadeActionsBar } from './PaymentMadeActionsBar';
import { PaymentMadeListDialogs } from './PaymentMadeListDialogs';
import { PaymentMadeListDrawers } from './PaymentMadeListDrawers';
import { PaymentMadesListProvider } from './PaymentMadesListProvider';
import { PaymentMadesTable } from './PaymentMadesTable';
import { withPaymentMade } from './withPaymentMade';
import { withPaymentMadeActions } from './withPaymentMadeActions';
import type { WithPaymentMadeProps } from './withPaymentMade';
import { DashboardPageContent } from '@/components';
import { transformTableStateToQuery } from '@/utils';

interface WithPaymentMadeActionsProps {
  resetPaymentMadesTableState: () => void;
  resetPaymentMadesSelectedRows: () => void;
}

interface PaymentMadeListProps
  extends Pick<
      WithPaymentMadeProps,
      'paymentMadesTableState' | 'paymentsTableStateChanged'
    >,
    WithPaymentMadeActionsProps {}

function PaymentMadeListInner({
  paymentMadesTableState,
  paymentsTableStateChanged,
  resetPaymentMadesTableState,
  resetPaymentMadesSelectedRows,
}: PaymentMadeListProps) {
  React.useEffect(
    () => () => {
      resetPaymentMadesTableState();
      resetPaymentMadesSelectedRows();
    },
    [resetPaymentMadesTableState, resetPaymentMadesSelectedRows],
  );

  return (
    <PaymentMadesListProvider
      query={transformTableStateToQuery(paymentMadesTableState)}
      tableStateChanged={paymentsTableStateChanged}
    >
      <PaymentMadeActionsBar />
      <PaymentMadeListDialogs />
      <PaymentMadeListDrawers />

      <DashboardPageContent>
        <PaymentMadesTable />
      </DashboardPageContent>
    </PaymentMadesListProvider>
  );
}

export const PaymentMadeList = FF.pipe(
  PaymentMadeListInner,
  withPaymentMadeActions,
  withPaymentMade(({ paymentMadesTableState, paymentsTableStateChanged }) => ({
    paymentMadesTableState,
    paymentsTableStateChanged,
  })),
);

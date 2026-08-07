import React from 'react';

import '@/style/pages/PaymentMade/List.scss';

import { PaymentMadeActionsBar } from './PaymentMadeActionsBar';
import { PaymentMadeListDrawers } from './PaymentMadeListDrawers';
import { PaymentMadesListProvider } from './PaymentMadesListProvider';
import { PaymentMadesTable } from './PaymentMadesTable';
import { withPaymentMade } from './withPaymentMade';
import { withPaymentMadeActions } from './withPaymentMadeActions';
import type { WithPaymentMadeProps } from './withPaymentMade';
import { DashboardPageContent } from '@/components';
import { compose, transformTableStateToQuery } from '@/utils';

interface WithPaymentMadeActionsProps {
  resetPaymentMadesTableState: () => void;
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
}: PaymentMadeListProps) {
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
      <PaymentMadeListDrawers />

      <DashboardPageContent>
        <PaymentMadesTable />
      </DashboardPageContent>
    </PaymentMadesListProvider>
  );
}

export const PaymentMadeList = compose(
  withPaymentMade(({ paymentMadesTableState, paymentsTableStateChanged }) => ({
    paymentMadesTableState,
    paymentsTableStateChanged,
  })),
  withPaymentMadeActions,
)(PaymentMadeListInner);

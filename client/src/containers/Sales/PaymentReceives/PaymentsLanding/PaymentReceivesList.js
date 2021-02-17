import React from 'react';

import 'style/pages/PaymentReceive/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';
import PaymentReceiveActionsBar from './PaymentReceiveActionsBar';
import PaymentReceiveAlerts from '../PaymentReceiveAlerts';
import { PaymentReceivesListProvider } from './PaymentReceiptsListProvider';
import PaymentReceiveViewTabs from './PaymentReceiveViewTabs';
import PaymentReceivesTable from './PaymentReceivesTable';

import withPaymentReceives from './withPaymentReceives';

import { compose, transformTableStateToQuery } from 'utils';

/**
 * Payment receives list.
 */
function PaymentReceiveList({
  // #withPaymentReceives
  paymentReceivesTableState,
}) {
  return (
    <PaymentReceivesListProvider
      query={transformTableStateToQuery(paymentReceivesTableState)}
    >
      <PaymentReceiveActionsBar />

      <DashboardPageContent>
        <PaymentReceiveViewTabs />

        <DashboardContentTable>
          <PaymentReceivesTable />
        </DashboardContentTable>
      </DashboardPageContent>

      <PaymentReceiveAlerts />
    </PaymentReceivesListProvider>
  );
}

export default compose(
  withPaymentReceives(({ paymentReceivesTableState }) => ({
    paymentReceivesTableState,
  })),
)(PaymentReceiveList);

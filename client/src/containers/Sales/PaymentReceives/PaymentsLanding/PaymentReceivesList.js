import React from 'react';

import 'style/pages/PaymentReceive/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';
import PaymentReceiveActionsBar from './PaymentReceiveActionsBar';
import PaymentReceiveAlerts from '../PaymentReceiveAlerts';
import { PaymentReceivesListProvider } from './PaymentReceiptsListProvider';
import PaymentReceiveViewTabs from './PaymentReceiveViewTabs';
import PaymentReceivesTable from './PaymentReceivesTable';

import withPaymentReceives from './withPaymentReceives';
import withPaymentReceivesActions from './withPaymentReceivesActions';

import { compose, transformTableStateToQuery } from 'utils';

/**
 * Payment receives list.
 */
function PaymentReceiveList({
  // #withPaymentReceives
  paymentReceivesTableState,

  // #withPaymentReceivesActions
  setPaymentReceivesTableState
}) {
  // Resets the payment receives table state once the page unmount.
  React.useEffect(
    () => () => {
      setPaymentReceivesTableState({
        filterRoles: [],
        viewSlug: '',
        pageIndex: 0,
      });
    },
    [setPaymentReceivesTableState],
  );

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
  withPaymentReceivesActions,
)(PaymentReceiveList);

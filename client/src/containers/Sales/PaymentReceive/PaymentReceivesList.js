import React, { useEffect, useCallback, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import PaymentReceivesDataTable from './PaymentReceivesDataTable';
import PaymentReceiveActionsBar from './PaymentReceiveActionsBar';
import PaymentReceiveViewTabs from './PaymentReceiveViewTabs';
import PaymentReceiveAlerts from './PaymentReceiveAlerts';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withPaymentReceives from './withPaymentReceives';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

function PaymentReceiveList({
  // #withDashboardActions
  changePageTitle,

  //#withPaymentReceives
  paymentReceivesTableQuery,

  // #withAlertsActions.
  openAlert,

  // #withDrawerActions
  openDrawer,

  //#withPaymentReceivesActions
  requestFetchPaymentReceiveTable,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'payment_Receives_list' }));
  }, [changePageTitle, formatMessage]);

  const fetchPaymentReceives = useQuery(
    ['paymentReceives-table', paymentReceivesTableQuery],
    () => requestFetchPaymentReceiveTable(),
  );

  // Handle delete Payment Receive
  const handleDeletePaymentReceive = useCallback(
    ({ id }) => {
      openAlert('payment-receive-delete', { paymentReceiveId: id });
    },
    [openAlert],
  );

  const handleEditPaymentReceive = useCallback((payment) => {
    history.push(`/payment-receives/${payment.id}/edit`);
  });

  const handlePaymentReceiveDrawer = useCallback(() => {
    openDrawer('payment-receive-drawer', {});
  }, [openDrawer]);

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, [fetchPaymentReceives]);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (_payment) => {
      setSelectedRows(_payment);
    },
    [setSelectedRows],
  );

  return (
    <DashboardInsider name={'payment_receives'}>
      <PaymentReceiveActionsBar
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
      />
      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/payment-receives/:custom_view_id/custom_view',
              '/payment-receives',
            ]}
          >
            <PaymentReceiveViewTabs />
            <PaymentReceivesDataTable
              onDeletePaymentReceive={handleDeletePaymentReceive}
              onEditPaymentReceive={handleEditPaymentReceive}
              onDrawerPaymentReceive={handlePaymentReceiveDrawer}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>
        <PaymentReceiveAlerts />
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withPaymentReceivesActions,
  withDashboardActions,
  withPaymentReceives(({ paymentReceivesTableQuery }) => ({
    paymentReceivesTableQuery,
  })),
  withAlertsActions,
  withDrawerActions,
)(PaymentReceiveList);

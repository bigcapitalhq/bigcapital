import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery, queryCache } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import PaymentReceivesDataTable from './PaymentReceivesDataTable';
import PaymentReceiveActionsBar from './PaymentReceiveActionsBar';
import PaymentReceiveViewTabs from './PaymentReceiveViewTabs';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withPaymentReceives from './withPaymentReceives';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withViewsActions from 'containers/Views/withViewsActions';

import { compose } from 'utils';

function PaymentReceiveList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  //#withPaymentReceives
  paymentReceivesTableQuery,

  //#withPaymentReceivesActions
  requestFetchPaymentReceiveTable,
  requestDeletePaymentReceive,
  addPaymentReceivesTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deletePaymentReceive, setDeletePaymentReceive] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'payment_Receive_list' }));
  }, [changePageTitle, formatMessage]);

  const fetchResourceViews = useQuery(
    ['resource-views', 'payment_receives'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  const fetchResourceFields = useQuery(
    ['resource-fields', 'payment_receives'],
    (key, resourceName) => requestFetchResourceFields(resourceName),
  );

  const fetchPaymentReceives = useQuery(
    ['paymantReceives-table', paymentReceivesTableQuery],
    () => requestFetchPaymentReceiveTable(),
  );

  // Handle dalete Payment Receive
  const handleDeletePaymentReceive = useCallback(
    (paymentReceive) => {
      setDeletePaymentReceive(paymentReceive);
    },
    [setDeletePaymentReceive],
  );

  // Handle cancel payment Receive.
  const handleCancelPaymentReceiveDelete = useCallback(() => {
    setDeletePaymentReceive(false);
  }, [setDeletePaymentReceive]);

  // Handle confirm delete payment receive.
  const handleConfirmPaymentReceiveDelete = useCallback(() => {
    requestDeletePaymentReceive(deletePaymentReceive.id).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_payment_receive_has_been_successfully_deleted',
        }),
        intent: Intent.SUCCESS,
      });
      setDeletePaymentReceive(false);
    });
  }, [deletePaymentReceive, requestDeletePaymentReceive, formatMessage]);

  const handleEditPaymentReceive = useCallback((payment) => {
    history.push(`/payment-receive/${payment.id}/edit`);
  });

  // Calculates the selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

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
    <DashboardInsider
      // loading={fetchResourceViews.isFetching || fetchResourceFields.isFetching}
      name={'payment_receives'}
    >
      <PaymentReceiveActionsBar
        // onBulkDelete={}
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
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon={'trash'}
          intent={Intent.DANGER}
          isOpen={deletePaymentReceive}
          onCancel={handleCancelPaymentReceiveDelete}
          onConfirm={handleConfirmPaymentReceiveDelete}
        >
          <p>
            <T id={'once_delete_this_payment_receive_you_will_able_to_restore_it'} />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withPaymentReceivesActions,
  withDashboardActions,
  withViewsActions,
  withPaymentReceives(({ paymentReceivesTableQuery }) => ({
    paymentReceivesTableQuery,
  })),
)(PaymentReceiveList);

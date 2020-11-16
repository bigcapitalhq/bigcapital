import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery, queryCache } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import PaymentMadeDataTable from './PaymentMadeDataTable';
import PaymentMadeActionsBar from './PaymentMadeActionsBar';
import PaymentMadeViewTabs from './PaymentMadeViewTabs';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withPaymentMades from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';
import withViewsActions from 'containers/Views/withViewsActions';

import { compose } from 'utils';

function PaymentMadeList({
  //#withDashboardActions
  changePageTitle,

  //#withViewsActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  //#withPaymentMades
  paymentMadeTableQuery,

  //#withPaymentMadesActions
  requestFetchPaymentMadesTable,
  requestDeletePaymentMade,
  addPaymentMadesTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deletePaymentMade, setDeletePaymentMade] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'payment_made_list' }));
  }, [changePageTitle, formatMessage]);

  const fetchResourceViews = useQuery(
    ['resource-views', 'bill_payments'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  const fetchResourceFields = useQuery(
    ['resource-fields', 'bill_payments'],
    (key, resourceName) => requestFetchResourceFields(resourceName),
  );

  const fetchPaymentMades = useQuery(
    ['paymantMades-table', paymentMadeTableQuery],
    () => requestFetchPaymentMadesTable(),
  );

  //handle dalete Payment Made
  const handleDeletePaymentMade = useCallback(
    (paymentMade) => {
      setDeletePaymentMade(paymentMade);
    },
    [setDeletePaymentMade],
  );

  // handle cancel Payment Made
  const handleCancelPaymentMadeDelete = useCallback(() => {
    setDeletePaymentMade(false);
  }, [setDeletePaymentMade]);

  // handleConfirm delete  payment made
  const handleConfirmPaymentMadeDelete = useCallback(() => {
    requestDeletePaymentMade(deletePaymentMade.id).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_payment_made_has_been_successfully_deleted',
        }),
        intent: Intent.SUCCESS,
      });
      setDeletePaymentMade(false);
    });
  }, [deletePaymentMade, requestDeletePaymentMade, formatMessage]);

  const handleEditPaymentMade = useCallback((payment) => {
    history.push(`/payment-made/${payment.id}/edit`);
  });

  // Calculates the selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, [fetchPaymentMades]);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (payment) => {
      setSelectedRows(payment);
    },
    [setSelectedRows],
  );

  return (
    <DashboardInsider
      // loading={fetchResourceViews.isFetching || fetchResourceFields.isFetching}
      name={'payment_made'}
    >
      <PaymentMadeActionsBar
        // onBulkDelete={}
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
      />
      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/payment-mades/:custom_view_id/custom_view',
              '/payment-mades',
            ]}
          >
            <PaymentMadeViewTabs />
            <PaymentMadeDataTable
              onDeletePaymentMade={handleDeletePaymentMade}
              onEditPaymentMade={handleEditPaymentMade}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon={'trash'}
          intent={Intent.DANGER}
          isOpen={deletePaymentMade}
          onCancel={handleCancelPaymentMadeDelete}
          onConfirm={handleConfirmPaymentMadeDelete}
        >
          <p>
            <T
              id={'once_delete_this_payment_made_you_will_able_to_restore_it'}
            />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withPaymentMadeActions,
  withDashboardActions,
  withViewsActions,
  withPaymentMades(({ paymentMadeTableQuery }) => ({
    paymentMadeTableQuery,
  })),
)(PaymentMadeList);

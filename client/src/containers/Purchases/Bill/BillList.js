import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery, queryCache } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import BillsDataTable from './BillsDataTable';
import BillActionsBar from './BillActionsBar';
import BillViewTabs from './BillViewTabs';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';

import withBills from './withBills';
import withBillActions from './withBillActions';
import withViewsActions from 'containers/Views/withViewsActions';

import { compose } from 'utils';

function BillList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  //#withBills
  billsTableQuery,

  //#withBillActions
  requestFetchBillsTable,
  requestDeleteBill,
  requestOpenBill,
  addBillsTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deleteBill, setDeleteBill] = useState(false);
  const [openBill, setOpenBill] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'bill_list' }));
  }, [changePageTitle, formatMessage]);

  const fetchResourceViews = useQuery(
    ['resource-views', 'bills'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  const fetchResourceFields = useQuery(
    ['resource-fields', 'bills'],
    (key, resourceName) => requestFetchResourceFields(resourceName),
  );

  const fetchBills = useQuery(['bills-table', billsTableQuery], () =>
    requestFetchBillsTable(),
  );

  //handle dalete Bill
  const handleDeleteBill = useCallback(
    (bill) => {
      setDeleteBill(bill);
    },
    [setDeleteBill],
  );

  // handle cancel Bill
  const handleCancelBillDelete = useCallback(() => {
    setDeleteBill(false);
  }, [setDeleteBill]);

  // handleConfirm delete invoice
  const handleConfirmBillDelete = useCallback(() => {
    requestDeleteBill(deleteBill.id).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_bill_has_been_successfully_deleted',
        }),
        intent: Intent.SUCCESS,
      });
      setDeleteBill(false);
    });
  }, [deleteBill, requestDeleteBill, formatMessage]);

  // Handle cancel/confirm bill open.
  const handleOpenBill = useCallback((bill) => {
    setOpenBill(bill);
  }, []);

  // Handle cancel open bill alert.
  const handleCancelOpenBill = useCallback(() => {
    setOpenBill(false);
  }, []);

  // Handle confirm bill open.
  const handleConfirmBillOpen = useCallback(() => {
    requestOpenBill(openBill.id)
      .then(() => {
        setOpenBill(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_bill_has_been_successfully_opened',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('bills-table');
      })
      .catch((error) => {});
  }, [openBill, requestOpenBill, formatMessage]);

  const handleEditBill = useCallback((bill) => {
    history.push(`/bills/${bill.id}/edit`);
  });

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (_invoices) => {
      setSelectedRows(_invoices);
    },
    [setSelectedRows],
  );

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(
    (filterConditions) => {
      addBillsTableQueries({
        filter_roles: filterConditions || '',
      });
    },
    [fetchBills],
  );

  return (
    <DashboardInsider
      loading={fetchResourceViews.isFetching || fetchResourceFields.isFetching}
      name={'bills'}
    >
      <BillActionsBar
        // onBulkDelete={}
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
      />
      <DashboardPageContent>
        <Switch>
          <Route exact={true}>
            <BillViewTabs />
            <BillsDataTable
              onDeleteBill={handleDeleteBill}
              onEditBill={handleEditBill}
              onOpenBill={handleOpenBill}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon={'trash'}
          intent={Intent.DANGER}
          isOpen={deleteBill}
          onCancel={handleCancelBillDelete}
          onConfirm={handleConfirmBillDelete}
        >
          <p>
            <T id={'once_delete_this_bill_you_will_able_to_restore_it'} />
          </p>
        </Alert>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'open'} />}
          intent={Intent.WARNING}
          isOpen={openBill}
          onCancel={handleCancelOpenBill}
          onConfirm={handleConfirmBillOpen}
        >
          <p>
            <T id={'are_sure_to_open_this_bill'} />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withBillActions,
  withDashboardActions,
  withViewsActions,
  withBills(({ billsTableQuery }) => ({
    billsTableQuery,
  })),
)(BillList);

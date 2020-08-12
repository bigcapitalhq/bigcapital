import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery, queryCache } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import ReceiptsDataTable from './ReceiptsDataTable';
import ReceiptActionsBar from './ReceiptActionsBar';
import ReceiptViewTabs from './ReceiptViewTabs';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withReceipts from './withReceipts';
import withReceipActions from './withReceipActions';
import withViewsActions from 'containers/Views/withViewsActions';

import { compose } from 'utils';

function ReceiptList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  //#withReceipts
  receiptTableQuery,
  receiptview,

  //#withReceiptActions
  requestFetchReceiptsTable,
  requestDeleteReceipt,
  addReceiptsTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deleteReceipt, setDeleteReceipt] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchReceipts = useQuery(['receipts-table', receiptTableQuery], () =>
    requestFetchReceiptsTable(),
  );

  const fetchResourceViews = useQuery(
    ['resource-views', 'sales_receipts'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  const fetchResourceFields = useQuery(
    ['resource-fields', 'sales_receipts'],
    (key, resourceName) => requestFetchResourceFields(resourceName),
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'receipt_list' }));
  }, [changePageTitle, formatMessage]);

  // handle delete receipt click
  const handleDeleteReceipt = useCallback(
    (_receipt) => {
      setDeleteReceipt(_receipt);
    },
    [setDeleteReceipt],
  );

  // handle cancel receipt
  const handleCancelReceiptDelete = useCallback(() => {
    setDeleteReceipt(false);
  }, [setDeleteReceipt]);

  // handle confirm delete receipt
  const handleConfirmReceiptDelete = useCallback(() => {
    requestDeleteReceipt(deleteReceipt.id).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_receipt_has_been_successfully_deleted',
        }),
        intent: Intent.SUCCESS,
      });
      setDeleteReceipt(false);
    });
  }, [deleteReceipt, requestDeleteReceipt, formatMessage]);

  // Handle filter change to re-fetch data-table.
  // const handleFilterChanged = useCallback(
  //   (filterConditions) => {
  //     addReceiptsTableQueries({
  //       filter_roles: filterConditions || '',
  //     });
  //   },
  //   [fetchReceipt],
  // );

    // Handle filter change to re-fetch data-table.
    const handleFilterChanged = useCallback(() => {}, [fetchReceipts]);



  // Calculates the selected rows
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  const handleEditReceipt = useCallback(
    (receipt) => {
      history.push(`/receipts/${receipt.id}/edit`);
    },
    [history],
  );
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      const page = pageIndex + 1;

      addReceiptsTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
        page_size: pageSize,
        page,
      });
    },
    [addReceiptsTableQueries],
  );

  const handleSelectedRowsChange = useCallback(
    (estimate) => {
      setSelectedRows(estimate);
    },
    [setSelectedRows],
  );

  return (
    <DashboardInsider
      name={'sales_receipts'}
      loading={fetchResourceViews.isFetching || fetchResourceFields.isFetching}
    >
      <DashboardPageContent>
        <ReceiptActionsBar
          selectedRows={selectedRows}
          onFilterChanged={handleFilterChanged}
        />
        <Switch>
          <Route
            exact={true}
            path={['/receipts/:custom_view_id/custom_view', '/receipts']}
          >
            <ReceiptViewTabs />
            <ReceiptsDataTable
              loading={fetchReceipts.isLoading}
              onDeleteReceipt={handleDeleteReceipt}
              onFetchData={handleFetchData}
              onEditReceipt={handleEditReceipt}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon={'trash'}
          intent={Intent.DANGER}
          isOpen={deleteReceipt}
          onCancel={handleCancelReceiptDelete}
          onConfirm={handleConfirmReceiptDelete}
        >
          <p>
            <T id={'once_delete_this_receipt_you_will_able_to_restore_it'} />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withReceipActions,
  withDashboardActions,
  withViewsActions,
  withReceipts(({ receiptTableQuery }) => ({
    receiptTableQuery,
  })),
)(ReceiptList);

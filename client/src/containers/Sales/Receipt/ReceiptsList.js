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
import withReceiptActions from './withReceiptActions';
import withViewsActions from 'containers/Views/withViewsActions';

import { compose } from 'utils';

function ReceiptsList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  //#withReceipts
  receiptTableQuery,

  //#withReceiptActions
  requestFetchReceiptsTable,
  requestDeleteReceipt,
  requestCloseReceipt,
  addReceiptsTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deleteReceipt, setDeleteReceipt] = useState(false);
  const [closeReceipt, setCloseReceipt] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchReceipts = useQuery(
    ['receipts-table', receiptTableQuery],
    (key, query) => requestFetchReceiptsTable({ ...query }),
  );

  const fetchResourceViews = useQuery(
    ['resource-views', 'sale_receipt'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'receipts_list' }));
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

  // Handle cancel/confirm receipt deliver.
  const handleCloseReceipt = useCallback((receipt) => {
    setCloseReceipt(receipt);
  }, []);

  // Handle cancel close receipt alert.
  const handleCancelCloseReceipt = useCallback(() => {
    setCloseReceipt(false);
  }, []);

  // Handle confirm receipt close.
  const handleConfirmReceiptClose = useCallback(() => {
    requestCloseReceipt(closeReceipt.id)
      .then(() => {
        setCloseReceipt(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_receipt_has_been_successfully_closed',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('receipts-table');
      })
      .catch((error) => {
        setCloseReceipt(false);
      });
  }, [closeReceipt, requestCloseReceipt, formatMessage]);

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

  const handleSelectedRowsChange = useCallback(
    (estimate) => {
      setSelectedRows(estimate);
    },
    [setSelectedRows],
  );

  return (
    <DashboardInsider
      name={'sales_receipts'}
      loading={fetchResourceViews.isFetching}
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
              onDeleteReceipt={handleDeleteReceipt}
              onEditReceipt={handleEditReceipt}
              onCloseReceipt={handleCloseReceipt}
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
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'close'} />}
          intent={Intent.WARNING}
          isOpen={closeReceipt}
          onCancel={handleCancelCloseReceipt}
          onConfirm={handleConfirmReceiptClose}
        >
          <p>
            <T id={'are_sure_to_close_this_receipt'} />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withReceiptActions,
  withDashboardActions,
  withViewsActions,
  withReceipts(({ receiptTableQuery }) => ({
    receiptTableQuery,
  })),
)(ReceiptsList);

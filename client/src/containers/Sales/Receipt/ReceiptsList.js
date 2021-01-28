import React, { useEffect, useCallback, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import ReceiptsDataTable from './ReceiptsDataTable';
import ReceiptActionsBar from './ReceiptActionsBar';
import ReceiptViewTabs from './ReceiptViewTabs';
import ReceiptsAlerts from './ReceiptsAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withReceipts from './withReceipts';
import withReceiptActions from './withReceiptActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

function ReceiptsList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,

  //#withReceipts
  receiptTableQuery,

  // #withAlertsActions,
  openAlert,

  //#withReceiptActions
  requestFetchReceiptsTable,
  addReceiptsTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
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
    ({ id }) => {
      openAlert('receipt-delete', { receiptId: id });
    },
    [openAlert],
  );

  // Handle cancel/confirm receipt deliver.
  const handleCloseReceipt = useCallback(({ id }) => {
    openAlert('receipt-close', { receiptId: id });
  }, []);

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, [fetchReceipts]);

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
        <ReceiptsAlerts />
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
  withAlertsActions,
)(ReceiptsList);

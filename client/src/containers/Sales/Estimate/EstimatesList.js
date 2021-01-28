import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery, queryCache } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import EstimatesAlerts from './EstimatesAlerts';
import EstimatesDataTable from './EstimatesDataTable';
import EstimateActionsBar from './EstimateActionsBar';
import EstimateViewTabs from './EstimateViewTabs';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withEstimates from './withEstimates';
import withEstimateActions from 'containers/Sales/Estimate/withEstimateActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

function EstimatesList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  // #withEstimate
  estimatesTableQuery,
  estimateViews,

  // #withAlertsActions.
  openAlert,

  //#withEistimateActions
  requestFetchEstimatesTable,
  requestDeliverdEstimate,
  requestApproveEstimate,
  requestRejectEstimate,
  addEstimatesTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deliverEstimate, setDeliverEstimate] = useState(false);
  const [approveEstimate, setApproveEstimate] = useState(false);
  const [rejectEstimate, setRejectEstimate] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const fetchResourceViews = useQuery(
    ['resource-views', 'sale_estimate'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  const fetchResourceFields = useQuery(
    ['resource-fields', 'sale_estimate'],
    (key, resourceName) => requestFetchResourceFields(resourceName),
  );

  const fetchEstimate = useQuery(
    ['estimates-table', estimatesTableQuery],
    (key, _query) => requestFetchEstimatesTable({ ..._query }),
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'estimates_list' }));
  }, [changePageTitle, formatMessage]);

  // handle delete estimate click
  const handleDeleteEstimate = useCallback(
    ({ id }) => {
      openAlert('estimate-delete', { estimateId: id });
    },
    [openAlert],
  );

  // Handle cancel/confirm estimate deliver.
  const handleDeliverEstimate = useCallback(
    ({ id }) => {
      openAlert('estimate-deliver', { estimateId: id });
    },
    [openAlert],
  );

  // Handle cancel/confirm estimate approve.
  const handleApproveEstimate = useCallback(
    ({ id }) => {
      openAlert('estimate-Approve', { estimateId: id });
    },
    [openAlert],
  );

  // Handle cancel/confirm estimate reject.
  const handleRejectEstimate = useCallback(
    ({ id }) => {
      openAlert('estimate-reject', { estimateId: id });
    },
    [openAlert],
  );

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, []);

  // Calculates the selected rows
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  const handleEditEstimate = useCallback(
    (estimate) => {
      history.push(`/estimates/${estimate.id}/edit`);
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
      loading={fetchResourceViews.isFetching || fetchResourceFields.isFetching}
      name={'sale_estimate'}
    >
      <EstimateActionsBar
        // onBulkDelete={}
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
      />
      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={['/estimates/:custom_view_id/custom_view', '/estimates']}
          >
            <EstimateViewTabs />
            <EstimatesDataTable
              onDeleteEstimate={handleDeleteEstimate}
              onEditEstimate={handleEditEstimate}
              onDeliverEstimate={handleDeliverEstimate}
              onApproveEstimate={handleApproveEstimate}
              onRejectEstimate={handleRejectEstimate}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>
        <EstimatesAlerts />
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withEstimateActions,
  withDashboardActions,
  withViewsActions,
  withEstimates(({ estimatesTableQuery, estimateViews }) => ({
    estimatesTableQuery,
    estimateViews,
  })),
  withAlertsActions,
)(EstimatesList);

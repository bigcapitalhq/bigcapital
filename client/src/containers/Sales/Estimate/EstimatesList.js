import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery, queryCache } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import EstimatesDataTable from './EstimatesDataTable';
import EstimateActionsBar from './EstimateActionsBar';
import EstimateViewTabs from './EstimateViewTabs';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withEstimates from './withEstimates';
import withEstimateActions from './withEstimateActions';
import withViewsActions from 'containers/Views/withViewsActions';

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

  //#withEistimateActions
  requestFetchEstimatesTable,
  requestDeleteEstimate,
  requestDeliverdEstimate,
  requestApproveEstimate,
  requestRejectEstimate,
  addEstimatesTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deleteEstimate, setDeleteEstimate] = useState(false);
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
    (estimate) => {
      setDeleteEstimate(estimate);
    },
    [setDeleteEstimate],
  );

  // handle cancel estimate
  const handleCancelEstimateDelete = useCallback(() => {
    setDeleteEstimate(false);
  }, [setDeleteEstimate]);

  // handle confirm delete estimate
  const handleConfirmEstimateDelete = useCallback(() => {
    requestDeleteEstimate(deleteEstimate.id).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_estimate_has_been_deleted_successfully',
        }),
        intent: Intent.SUCCESS,
      });
      setDeleteEstimate(false);
    });
  }, [deleteEstimate, requestDeleteEstimate, formatMessage]);

  // Handle cancel/confirm estimate deliver.
  const handleDeliverEstimate = useCallback((estimate) => {
    setDeliverEstimate(estimate);
  }, []);

  // Handle cancel deliver estimate alert.
  const handleCancelDeliverEstimate = useCallback(() => {
    setDeliverEstimate(false);
  }, []);

  // Handle confirm estimate deliver.
  const handleConfirmEstimateDeliver = useCallback(() => {
    requestDeliverdEstimate(deliverEstimate.id)
      .then(() => {
        setDeliverEstimate(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_estimate_has_been_delivered_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('estimates-table');
      })
      .catch((error) => {
        setDeliverEstimate(false);
      });
  }, [deliverEstimate, requestDeliverdEstimate, formatMessage]);

  // Handle cancel/confirm estimate approve.
  const handleApproveEstimate = useCallback((estimate) => {
    setApproveEstimate(estimate);
  }, []);

  // Handle cancel approve estimate alert.
  const handleCancelApproveEstimate = useCallback(() => {
    setApproveEstimate(false);
  }, []);

  // Handle confirm estimate approve.
  const handleConfirmEstimateApprove = useCallback(() => {
    requestApproveEstimate(approveEstimate.id)
      .then(() => {
        setApproveEstimate(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_estimate_has_been_approved_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('estimates-table');
      })
      .catch((error) => {
        setApproveEstimate(false);
      });
  }, [approveEstimate, requestApproveEstimate, formatMessage]);

  // Handle cancel/confirm estimate reject.
  const handleRejectEstimate = useCallback((estimate) => {
    setRejectEstimate(estimate);
  }, []);

  // Handle cancel reject estimate alert.
  const handleCancelRejectEstimate = useCallback(() => {
    setRejectEstimate(false);
  }, []);

  // Handle confirm estimate reject.
  const handleConfirmEstimateReject = useCallback(() => {
    requestRejectEstimate(rejectEstimate.id)
      .then(() => {
        setRejectEstimate(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_estimate_has_been_rejected_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('estimates-table');
      })
      .catch((error) => {});
  }, [rejectEstimate, requestRejectEstimate, formatMessage]);

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

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon={'trash'}
          intent={Intent.DANGER}
          isOpen={deleteEstimate}
          onCancel={handleCancelEstimateDelete}
          onConfirm={handleConfirmEstimateDelete}
        >
          <p>
            <T id={'once_delete_this_estimate_you_will_able_to_restore_it'} />
          </p>
        </Alert>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'deliver'} />}
          intent={Intent.WARNING}
          isOpen={deliverEstimate}
          onCancel={handleCancelDeliverEstimate}
          onConfirm={handleConfirmEstimateDeliver}
        >
          <p>
            <T id={'are_sure_to_deliver_this_estimate'} />
          </p>
        </Alert>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'approve'} />}
          intent={Intent.WARNING}
          isOpen={approveEstimate}
          onCancel={handleCancelApproveEstimate}
          onConfirm={handleConfirmEstimateApprove}
        >
          <p>
            <T id={'are_sure_to_approve_this_estimate'} />
          </p>
        </Alert>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'reject'} />}
          intent={Intent.WARNING}
          isOpen={rejectEstimate}
          onCancel={handleCancelRejectEstimate}
          onConfirm={handleConfirmEstimateReject}
        >
          <p>
            <T id={'are_sure_to_approve_this_estimate'} />
          </p>
        </Alert>
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
)(EstimatesList);

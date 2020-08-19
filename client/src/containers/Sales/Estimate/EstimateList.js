import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
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

function EstimateList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  // #withEstimate
  estimateTableQuery,
  estimateViews,

  //#withEistimateActions
  requestFetchEstimatesTable,
  requestDeleteEstimate,
  addEstimatesTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deleteEstimate, setDeleteEstimate] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchResourceViews = useQuery(
    ['resource-views', 'sales_estimates'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  const fetchResourceFields = useQuery(
    ['resource-fields', 'sales_estimates'],
    (key, resourceName) => requestFetchResourceFields(resourceName),
  );

  const fetchEstimate = useQuery(['estimates-table', estimateTableQuery], () =>
    requestFetchEstimatesTable(),
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'estimate_list' }));
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
          id: 'the_estimate_has_been_successfully_deleted',
        }),
        intent: Intent.SUCCESS,
      });
      setDeleteEstimate(false);
    });
  }, [deleteEstimate, requestDeleteEstimate, formatMessage]);

  // // Handle filter change to re-fetch data-table.
  // const handleFilterChanged = useCallback(
  //   (filterConditions) => {
  //     addEstimatesTableQueries({
  //       filter_roles: filterConditions || '',
  //     });
  //   },
  //   [fetchEstimate],
  // );

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, [fetchEstimate]);

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
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      const page = pageIndex + 1;

      addEstimatesTableQueries({
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
    [addEstimatesTableQueries],
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
      name={'sales_estimates'}
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
              loading={fetchEstimate.isFetching}
              onDeleteEstimate={handleDeleteEstimate}
              onFetchData={handleFetchData}
              onEditEstimate={handleEditEstimate}
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
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withEstimateActions,
  withDashboardActions,
  withViewsActions,
  withEstimates(({ estimateTableQuery, estimateViews }) => ({
    estimateTableQuery,
    estimateViews,
  })),
)(EstimateList);

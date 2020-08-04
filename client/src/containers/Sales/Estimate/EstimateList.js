import React, { useEffect, useCallback, useMemo } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery, queryCache } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withEstimateActions from './withEstimateActions';

import EstimateActionsBar from './EstimateActionsBar';

import { compose } from 'utils';

function EstimateList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions

  // #withEstimate

  //#withEistimateActions
  requestFetchEstimatesTable,
  requestDeleteEstimate,
  addEstimatesTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deleteEstimate, setDeleteEstimate] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchEstimate = useQuery(['estimate-table'], () =>
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
    requestDeleteEstimate(deleteEstimate.id).then((response) => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_estimate_has_been_successfully_deleted',
        }),
        intent: Intent.SUCCESS,
      });
      setDeleteEstimate(false);
    });
  }, [deleteEstimate, requestDeleteEstimate, formatMessage]);

  // Calculates the selected rows
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  const handleEidtEstimate = useCallback(
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

  const handleSelectedRowsChange = useCallback((estimate) => {
    selectedRows(estimate);
  });

  return (
    <DashboardInsider name={'estimates'}>
      <EstimateActionsBar
        // onBulkDelete={}
        selectedRows={selectedRows}
        // onFilterChanged={}
      />
      <DashboardPageContent>
        <Switch>
          <Route></Route>
        </Switch>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default EstimateList;

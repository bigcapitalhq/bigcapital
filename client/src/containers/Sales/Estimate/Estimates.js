import React, { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import EstimateForm from './EstimateForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withEstimateActions from './withEstimateActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function Estimates({
  // #withCustomersActions
  requestFetchCustomers,

  // #withItemsActions
  requestFetchItems,

  // #withEstimateActions
  requsetFetchEstimate,

  // #withSettingsActions
  requestFetchOptions,

  // #withDashboardActions
  setSidebarShrink,
  resetSidebarPreviousExpand
}) {
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    // Shrink the sidebar by foce.
    setSidebarShrink();

    return () => {
      // Reset the sidebar to the previous status.
      resetSidebarPreviousExpand();
    };
  }, [resetSidebarPreviousExpand, setSidebarShrink]);

  const fetchEstimate = useQuery(
    ['estimate', id],
    (key, _id) => requsetFetchEstimate(_id),
    { enabled: !!id },
  );

  // Handle fetch Items data table or list
  const fetchItems = useQuery('items-list', () => requestFetchItems({}));

  // Handle fetch customers data table or list
  const fetchCustomers = useQuery('customers-table', () =>
    requestFetchCustomers({}),
  );

  //
  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/estimates');
    },
    [history],
  );
  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  return (
    <DashboardInsider
      loading={
        fetchCustomers.isFetching ||
        fetchItems.isFetching ||
        fetchEstimate.isFetching
      }
      name={'estimate-form'}
    >
      <EstimateForm
        onFormSubmit={handleFormSubmit}
        estimateId={id}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(
  withEstimateActions,
  withCustomersActions,
  withItemsActions,
  withSettingsActions,
  withDashboardActions,
)(Estimates);

import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import EstimateForm from './EstimateForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withEstimateActions from './withEstimateActions';

import { compose } from 'utils';

function Estimates({
  requestFetchCustomers,
  requestFetchItems,
  requsetFetchEstimate,
}) {
  const history = useHistory();
  const { id } = useParams();

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
)(Estimates);

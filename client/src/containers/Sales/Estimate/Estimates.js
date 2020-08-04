import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import EstimateForm from './EstimateForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withEstimateActions from './withEstimateActions';

import { compose } from 'utils';

function Estimates({ requestFetchCustomers, requestFetchItems }) {
  const history = useHistory();
  const { id } = useParams();

  // Handle fetch customers data table or list
  const fetchCustomers = useQuery('customers-table', () =>
    requestFetchCustomers({}),
  );

  // Handle fetch Items data table or list
  const fetchItems = useQuery('items-table', () => requestFetchItems({}));

  const handleFormSubmit = useCallback((payload) => {}, [history]);

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={fetchCustomers.isFetching || fetchItems.isFetching}
    >
      <EstimateForm
        onFormSubmit={handleFormSubmit}
        // estimateId={id}
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

import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import CustomerForm from 'containers/Customers/CustomerForm';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCustomersActions from './withCustomersActions';

import { compose } from 'utils';

function Customer({
  // #withDashboardActions
  changePageTitle,

  formik,
  //#withCustomersActions
  requestFetchCustomers,
}) {
  const { id } = useParams();
  const history = useHistory();

  const fetchCustomers = useQuery('customers-list', () =>
    requestFetchCustomers({}),
  );

  const fetchCustomerDatails = useQuery(id && ['customer-detail', id], () =>
    requestFetchCustomers(),
  );

  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/customers');
    },
    [history],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={fetchCustomerDatails.isFetching || fetchCustomers.isFetching}
      name={'customer-form'}
    >
      <CustomerForm
        onFormSubmit={handleFormSubmit}
        customerId={id}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(withDashboardActions, withCustomersActions)(Customer);

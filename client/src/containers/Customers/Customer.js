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

  const fetchCustomerDatails =useQuery(id && ['customer-detail',id],()=>requestFetchCustomers())

  return (
    <DashboardInsider
      // formik={formik}
      loading={ fetchCustomerDatails.isFetching || fetchCustomers.isFetching}
      name={'customer-form'}
    >
      <CustomerForm customerId={id} />
    </DashboardInsider>
  );
}

export default compose(withDashboardActions, withCustomersActions)(Customer);

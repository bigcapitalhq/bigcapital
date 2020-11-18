import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import { DashboardCard } from 'components';
import CustomerForm from 'containers/Customers/CustomerForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withCustomersActions from './withCustomersActions';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';

import { compose } from 'utils';

function Customer({
  // // #withDashboardActions
  // changePageTitle,

  // formik,
  //#withCustomersActions
  requestFetchCustomers,
  requestFetchCustomer,

  // #wihtCurrenciesActions
  requestFetchCurrencies,
}) {
  const { id } = useParams();
  const history = useHistory();

  // Handle fetch customers data table
  const fetchCustomers = useQuery('customers-table', () =>
    requestFetchCustomers({}),
  );
  // Handle fetch customer details.
  const fetchCustomer = useQuery(
    ['customer', id],
    (key, customerId) => requestFetchCustomer(customerId),
    { enabled: id && id },
  );
  // Handle fetch Currencies data table
  const fetchCurrencies = useQuery('currencies', () =>
    requestFetchCurrencies(),
  );

  const handleFormSubmit = useCallback((payload) => {}, [history]);

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={
        fetchCustomer.isFetching ||
        fetchCustomers.isFetching ||
        fetchCurrencies.isFetching
      }
      name={'customer-form'}
    >
      <DashboardCard page>
        <CustomerForm
          onFormSubmit={handleFormSubmit}
          customerId={id}
          onCancelForm={handleCancel}
        />
      </DashboardCard>
    </DashboardInsider>
  );
}

export default compose(withCustomersActions, withCurrenciesActions)(Customer);

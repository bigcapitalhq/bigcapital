import React from 'react';
import { useParams } from 'react-router-dom';

import { DashboardCard } from 'components';
import CustomerForm from './CustomerForm';
import { CustomerFormProvider } from './CustomerFormProvider';

import withCustomersActions from './withCustomersActions';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';

import { compose } from 'utils';

import 'style/pages/Customers/PageForm.scss';

function CustomerFormPage() {
  const { id } = useParams();

  return (
    <CustomerFormProvider customerId={id}>
      <DashboardCard page>
        <CustomerForm />
      </DashboardCard>
    </CustomerFormProvider>
  );
}

export default compose(
  withCustomersActions,
  withCurrenciesActions,
)(CustomerFormPage);

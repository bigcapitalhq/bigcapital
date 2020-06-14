import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import CustomerForm from 'containers/Customers/CustomerForm';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function Customer({}) {
  return (
    <DashboardInsider name={'customer-form'}>
      <CustomerForm />
    </DashboardInsider>
  );
}

export default Customer;

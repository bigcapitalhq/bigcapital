import React, { createContext } from 'react';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useCustomers } from 'hooks/query';

const CustomersListContext = createContext();

function CustomersListProvider({ query, ...props }) {
  // Fetch customers resource views and fields.
  const {
    data: customersViews,
    isFetching: isCustomersViewsLoading,
  } = useResourceViews('customers');

  // Fetches customers data with pagination meta.
  const {
    data: { customers, pagination },
    isFetching: isCustomersLoading,
  } = useCustomers(query);

  const state = {
    customersViews,
    customers,
    pagination,

    isCustomersViewsLoading,
    isCustomersLoading,

    isEmptyStatus: false,
  };

  return (
    <DashboardInsider loading={isCustomersViewsLoading} name={'customers-list'}>
      <CustomersListContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useCustomersListContext = () => React.useContext(CustomersListContext);

export { CustomersListProvider, useCustomersListContext };

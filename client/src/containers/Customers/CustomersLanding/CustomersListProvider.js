import React, { createContext } from 'react';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceMeta, useResourceViews, useCustomers } from 'hooks/query';
import { isTableEmptyStatus, getFieldsFromResourceMeta } from 'utils';
import { transformCustomersStateToQuery } from './utils';

const CustomersListContext = createContext();

function CustomersListProvider({ tableState, ...props }) {
  // Transformes the table state to fetch query.
  const tableQuery = transformCustomersStateToQuery(tableState);

  // Fetch customers resource views and fields.
  const { data: customersViews, isLoading: isViewsLoading } =
    useResourceViews('customers');

  // Fetch the customers resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceMetaLoading,
    isFetching: isResourceMetaFetching,
  } = useResourceMeta('customers');

  // Fetches customers data with pagination meta.
  const {
    data: { customers, pagination, filterMeta },
    isLoading: isCustomersLoading,
    isFetching: isCustomersFetching,
  } = useCustomers(tableQuery, { keepPreviousData: true });

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isTableEmptyStatus({
      data: customers,
      pagination,
      filterMeta,
    }) &&
    !isCustomersFetching &&
    !tableState.inactiveMode;

  const state = {
    customersViews,
    customers,
    pagination,

    fields: getFieldsFromResourceMeta(resourceMeta.fields),
    resourceMeta,
    isResourceMetaLoading,
    isResourceMetaFetching,

    isViewsLoading,
    isCustomersLoading,
    isCustomersFetching,

    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceMetaLoading || isCustomersLoading}
      name={'customers-list'}
    >
      <CustomersListContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useCustomersListContext = () => React.useContext(CustomersListContext);

export { CustomersListProvider, useCustomersListContext };

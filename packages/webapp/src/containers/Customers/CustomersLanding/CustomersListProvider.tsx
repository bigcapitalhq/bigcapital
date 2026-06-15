// @ts-nocheck
import React, { createContext } from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components';
import { useResourceMeta, useResourceViews, useCustomers } from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';
import { transformCustomersStateToQuery } from './utils';

const CustomersListContext = createContext();

function CustomersListProvider({ tableState, tableStateChanged, ...props }) {
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
    data: customersData,
    isLoading: isCustomersLoading,
    isFetching: isCustomersFetching,
  } = useCustomers(tableQuery, {
    placeholderData: (previousData) => previousData,
  });

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isEmpty(customersData?.data) && !isCustomersLoading && !tableStateChanged;

  const state = {
    customersViews,
    customers: customersData?.data,
    pagination: customersData?.pagination,

    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
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
      loading={isViewsLoading || isResourceMetaLoading}
      name={'customers-list'}
    >
      <CustomersListContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useCustomersListContext = () => React.useContext(CustomersListContext);

export { CustomersListProvider, useCustomersListContext };

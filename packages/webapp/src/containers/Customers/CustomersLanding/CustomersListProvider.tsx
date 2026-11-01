import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import { transformCustomersStateToQuery } from './utils';
import type { TableQuery } from '@/store/store.types';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components';
import {
  useResourceMeta,
  useResourceViews,
  useCustomers,
  useSettingsCustomers,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

type UseCustomersResult = ReturnType<typeof useCustomers>;
type UseResourceViewsResult = ReturnType<typeof useResourceViews>;
type UseResourceMetaResult = ReturnType<typeof useResourceMeta>;

type CustomersListContextValue = {
  customersViews: UseResourceViewsResult['data'];
  customers: NonNullable<UseCustomersResult['data']>['data'] | undefined;
  pagination: NonNullable<UseCustomersResult['data']>['pagination'] | undefined;

  fields: ReturnType<typeof getFieldsFromResourceMeta> | [];
  resourceMeta: UseResourceMetaResult['data'];

  isViewsLoading: boolean;
  isCustomersLoading: boolean;
  isCustomersFetching: boolean;
  isResourceMetaLoading: boolean;
  isResourceMetaFetching: boolean;

  isEmptyStatus: boolean;

  customersSettings: SettingsGroup | undefined;
};

type CustomersListProviderProps = {
  tableState: Partial<TableQuery> & { inactiveMode?: boolean };
  tableStateChanged: boolean;
  children?: React.ReactNode;
};

const CustomersListContext = createContext<
  CustomersListContextValue | undefined
>(undefined);

function CustomersListProvider({
  tableState,
  tableStateChanged,
  children,
}: CustomersListProviderProps) {
  // Transformes the table state to fetch query.
  const tableQuery = transformCustomersStateToQuery(tableState);

  // Customers settings.
  const { data: customersSettings } = useSettingsCustomers();

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
  } = useCustomers(tableQuery);

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isEmpty(customersData?.data) && !isCustomersLoading && !tableStateChanged;

  const state: CustomersListContextValue = {
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

    customersSettings,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceMetaLoading}
      name={'customers-list'}
    >
      <CustomersListContext.Provider value={state}>
        {children}
      </CustomersListContext.Provider>
    </DashboardInsider>
  );
}

const useCustomersListContext = (): CustomersListContextValue => {
  const ctx = React.useContext(CustomersListContext);
  if (!ctx) {
    throw new Error(
      'useCustomersListContext must be used within a CustomersListProvider',
    );
  }
  return ctx;
};

export { CustomersListProvider, useCustomersListContext };

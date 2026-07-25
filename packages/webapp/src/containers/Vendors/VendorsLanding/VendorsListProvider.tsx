import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import { transformVendorsStateToQuery } from './utils';
import { DashboardInsider } from '@/components';
import {
  useResourceMeta,
  useResourceViews,
  useVendors,
  useSettingsVendors,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';
import type { TableQuery } from '@/store/store.types';
import type { SettingsGroup } from '@bigcapital/sdk-ts';

type UseVendorsResult = ReturnType<typeof useVendors>;
type UseResourceViewsResult = ReturnType<typeof useResourceViews>;
type UseResourceMetaResult = ReturnType<typeof useResourceMeta>;

type VendorsListContextValue = {
  vendors: NonNullable<UseVendorsResult['data']>['data'] | undefined;
  pagination: NonNullable<UseVendorsResult['data']>['pagination'] | undefined;
  vendorsViews: UseResourceViewsResult['data'];
  fields: ReturnType<typeof getFieldsFromResourceMeta> | [];
  resourceMeta: UseResourceMetaResult['data'];

  isResourceMetaLoading: boolean;
  isResourceMetaFetching: boolean;
  isVendorsViewsLoading: boolean;
  isVendorsLoading: boolean;
  isVendorsFetching: boolean;
  isEmptyStatus: boolean;

  vendorsSettings: SettingsGroup | undefined;
};

type VendorsListProviderProps = {
  tableState: Partial<TableQuery> & { inactiveMode?: boolean };
  tableStateChanged: boolean;
  children?: React.ReactNode;
};

const VendorsListContext = createContext<VendorsListContextValue | undefined>(
  undefined,
);

function VendorsListProvider({
  tableState,
  tableStateChanged,
  children,
}: VendorsListProviderProps) {
  // Transformes the vendors table state to fetch query.
  const tableQuery = transformVendorsStateToQuery(tableState);

  // Vendors settings.
  const { data: vendorsSettings } = useSettingsVendors();

  // Fetch vendors list with pagination meta.
  const {
    data: vendorsData,
    isLoading: isVendorsLoading,
    isFetching: isVendorsFetching,
  } = useVendors(tableQuery);

  // Fetch vendors resource views and fields.
  const { data: vendorsViews, isLoading: isVendorsViewsLoading } =
    useResourceViews('vendors');

  // Fetch the vendors resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceMetaLoading,
    isFetching: isResourceMetaFetching,
  } = useResourceMeta('vendors');

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isEmpty(vendorsData?.data) && !isVendorsLoading && !tableStateChanged;

  const provider: VendorsListContextValue = {
    vendors: vendorsData?.data,
    pagination: vendorsData?.pagination,
    vendorsViews,
    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    resourceMeta,
    isResourceMetaLoading,
    isResourceMetaFetching,
    isVendorsViewsLoading,
    isVendorsLoading,
    isVendorsFetching,
    isEmptyStatus,

    vendorsSettings,
  };

  return (
    <DashboardInsider
      loading={isVendorsViewsLoading || isResourceMetaLoading}
      name={'vendors-list'}
    >
      <VendorsListContext.Provider value={provider}>
        {children}
      </VendorsListContext.Provider>
    </DashboardInsider>
  );
}

const useVendorsListContext = (): VendorsListContextValue => {
  const ctx = React.useContext(VendorsListContext);
  if (!ctx) {
    throw new Error(
      'useVendorsListContext must be used within a VendorsListProvider',
    );
  }
  return ctx;
};

export { VendorsListProvider, useVendorsListContext };

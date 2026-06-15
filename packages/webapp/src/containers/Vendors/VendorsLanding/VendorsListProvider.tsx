// @ts-nocheck
import React, { createContext } from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components';
import { useResourceMeta, useResourceViews, useVendors } from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';
import { transformVendorsStateToQuery } from './utils';

const VendorsListContext = createContext();

function VendorsListProvider({ tableState, tableStateChanged, ...props }) {
  // Transformes the vendors table state to fetch query.
  const tableQuery = transformVendorsStateToQuery(tableState);

  // Fetch vendors list with pagination meta.
  const {
    data: vendorsData,
    isLoading: isVendorsLoading,
    isFetching: isVendorsFetching,
  } = useVendors(tableQuery, {
    placeholderData: (previousData) => previousData,
  });

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

  const provider = {
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
  };

  return (
    <DashboardInsider
      loading={isVendorsViewsLoading || isResourceMetaLoading}
      name={'vendors-list'}
    >
      <VendorsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorsListContext = () => React.useContext(VendorsListContext);

export { VendorsListProvider, useVendorsListContext };

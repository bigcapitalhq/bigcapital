import React, { createContext } from 'react';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useVendors } from 'hooks/query';
import { isTableEmptyStatus } from 'utils';
import { transformVendorsStateToQuery } from './utils';

const VendorsListContext = createContext();

function VendorsListProvider({ tableState, ...props }) {
  // Transformes the vendors table state to fetch query.
  const tableQuery = transformVendorsStateToQuery(tableState);

  // Fetch vendors list with pagination meta.
  const {
    data: { vendors, pagination, filterMeta },
    isLoading: isVendorsLoading,
    isFetching: isVendorsFetching,
  } = useVendors(tableQuery, { keepPreviousData: true });

  // Fetch customers resource views and fields.
  const { data: vendorsViews, isLoading: isVendorsViewsLoading } =
    useResourceViews('vendors');

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isTableEmptyStatus({
      data: vendors,
      pagination,
      filterMeta,
    }) &&
    !isVendorsLoading &&
    !tableState.inactiveMode;

  const provider = {
    vendors,
    pagination,
    vendorsViews,

    isVendorsLoading,
    isVendorsFetching,
    isVendorsViewsLoading,

    isEmptyStatus,
  };

  return (
    <DashboardInsider loading={isVendorsViewsLoading} name={'vendors-list'}>
      <VendorsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorsListContext = () => React.useContext(VendorsListContext);

export { VendorsListProvider, useVendorsListContext };

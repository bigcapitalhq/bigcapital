import React, { createContext } from 'react';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useVendors } from 'hooks/query';

const VendorsListContext = createContext();

function VendorsListProvider({ query, ...props }) {

  // Fetch vendors list with pagination meta.
  const {
    data: { vendors, pagination },
    isFetching: isVendorsLoading,
  } = useVendors(query);

  // Fetch customers resource views and fields.
  const {
    data: vendorsViews,
    isFetching: isVendorsViewsLoading,
  } = useResourceViews('vendors');

  const provider = {
    vendors,
    pagination,
    vendorsViews,
    isVendorsLoading,
    isVendorsViewsLoading,
  };

  return (
    <DashboardInsider loading={isVendorsViewsLoading} name={'vendors-list'}>
      <VendorsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorsListContext = () => React.useContext(VendorsListContext);

export { VendorsListProvider, useVendorsListContext };

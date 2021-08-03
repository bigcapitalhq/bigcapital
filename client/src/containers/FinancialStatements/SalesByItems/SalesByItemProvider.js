import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useSalesByItems, useItems } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const SalesByItemsContext = createContext();

function SalesByItemProvider({ query, ...props }) {
  const {
    data: salesByItems,
    isFetching,
    isLoading,
    refetch,
  } = useSalesByItems(
    {
      ...transformFilterFormToQuery(query),
    },
    {
      keepPreviousData: true,
    },
  );

  // Handle fetching the items based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
    isFetching: isItemsFetching,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: JSON.stringify([
      { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
    ]),
  });

  const provider = {
    salesByItems,
    isFetching,
    isLoading,

    items,
    isItemsLoading,
    isItemsFetching,

    refetchSheet: refetch,
  };
  return (
    <FinancialReportPage name={'sales-by-items'}>
      <SalesByItemsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useSalesByItemsContext = () => useContext(SalesByItemsContext);

export { SalesByItemProvider, useSalesByItemsContext };

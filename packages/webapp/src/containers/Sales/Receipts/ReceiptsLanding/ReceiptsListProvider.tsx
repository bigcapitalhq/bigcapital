// @ts-nocheck
import React, { createContext } from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components/Dashboard';

import { useResourceMeta, useResourceViews, useReceipts } from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

const ReceiptsListContext = createContext();

// Receipts list provider.
function ReceiptsListProvider({ query, tableStateChanged, ...props }) {
  // Fetch receipts resource views and fields.
  const { data: receiptsViews, isLoading: isViewsLoading } =
    useResourceViews('sale_receipt');

  // Fetches the sale receipts resource fields.
  const {
    data: resourceMeta,
    isFetching: isResourceFetching,
    isLoading: isResourceLoading,
  } = useResourceMeta('sale_receipt');

  const {
    data: { receipts, pagination, filterMeta },
    isLoading: isReceiptsLoading,
    isFetching: isReceiptsFetching,
  } = useReceipts(query, { keepPreviousData: true });

  // Determines the datatable empty status.
  const isEmptyStatus =
    isEmpty(receipts) && !tableStateChanged && !isReceiptsLoading;

  const provider = {
    receipts,
    pagination,

    receiptsViews,
    isViewsLoading,

    resourceMeta,
    fields: getFieldsFromResourceMeta(resourceMeta.fields),
    isResourceFetching,
    isResourceLoading,

    isReceiptsLoading,
    isReceiptsFetching,
    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'sales_receipts'}
    >
      <ReceiptsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useReceiptsListContext = () => React.useContext(ReceiptsListContext);

export { ReceiptsListProvider, useReceiptsListContext };

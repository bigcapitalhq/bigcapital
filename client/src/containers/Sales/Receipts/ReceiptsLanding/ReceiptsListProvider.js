import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useReceipts } from 'hooks/query';
import { isTableEmptyStatus } from 'utils';

const ReceiptsListContext = createContext();

// Receipts list provider.
function ReceiptsListProvider({ query, ...props }) {
  // Fetch receipts resource views and fields.
  const { data: receiptsViews, isLoading: isViewsLoading } = useResourceViews(
    'sale_receipt',
  );

  // Fetches the sale receipts resource fields.
  // const {
  //   data: receiptsFields,
  //   isFetching: isFieldsLoading,
  // } = useResourceFields('sale_receipt');

  const {
    data: { receipts, pagination, filterMeta },
    isLoading: isReceiptsLoading,
    isFetching: isReceiptsFetching,
  } = useReceipts(query, { keepPreviousData: true });
  
  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isTableEmptyStatus({
      data: receipts,
      pagination,
      filterMeta,
    }) && !isReceiptsLoading;

  const provider = {
    receipts,
    pagination,
    // receiptsFields,
    receiptsViews,
    isViewsLoading,
    // isFieldsLoading,
    isReceiptsLoading,
    isReceiptsFetching,
    isEmptyStatus
  };

  return (
    <DashboardInsider
      loading={isViewsLoading}
      name={'sales_receipts'}
    >
      <ReceiptsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useReceiptsListContext = () => React.useContext(ReceiptsListContext);

export { ReceiptsListProvider, useReceiptsListContext };

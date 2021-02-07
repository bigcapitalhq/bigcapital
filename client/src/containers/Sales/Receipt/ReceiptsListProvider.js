import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, useReceipts } from 'hooks/query';


const ReceiptsListContext = createContext();

// Receipts list provider.
function ReceiptsListProvider({ query, ...props }) {
  // Fetch receipts resource views and fields.
  const { data: receiptsViews, isFetching: isViewsLoading } = useResourceViews(
    'sale_receipt',
  );

  // Fetches the sale receipts resource fields.
  // const {
  //   data: receiptsFields,
  //   isFetching: isFieldsLoading,
  // } = useResourceFields('sale_receipt');

  const {
    data: { receipts, pagination },
    isFetching: isReceiptsLoading,
  } = useReceipts(query);

  const provider = {
    receipts,
    pagination,
    // receiptsFields,
    receiptsViews,
    isViewsLoading,
    // isFieldsLoading,
    isReceiptsLoading,
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

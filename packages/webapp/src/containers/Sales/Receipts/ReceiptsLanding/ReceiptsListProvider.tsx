import { keepPreviousData } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type { ReceiptTableRow } from './components';
import type { IResourceField } from '@/components/AdvancedFilter/interfaces';
import type {
  SettingsGroup,
  SaleReceiptsListResponse,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceMeta,
  useResourceViews,
  useReceipts,
  useSettingsReceipts,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

interface ReceiptsListProviderProps {
  query?: any;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
}

export interface ReceiptsListContextValue {
  receipts: SaleReceiptsListResponse['data'] | undefined;
  pagination: { total?: number; [key: string]: any } | undefined;
  resourceMeta: any;
  fields: IResourceField[];
  receiptsViews: any;
  isResourceLoading: boolean;
  isResourceFetching: boolean;
  isReceiptsLoading: boolean;
  isReceiptsFetching: boolean;
  isViewsLoading: boolean;
  isEmptyStatus: boolean;
  receiptSettings: SettingsGroup | undefined;
}

const ReceiptsListContext = createContext<ReceiptsListContextValue>(
  {} as ReceiptsListContextValue,
);

// Receipts list provider.
function ReceiptsListProvider({
  query,
  tableStateChanged,
  ...props
}: ReceiptsListProviderProps) {
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
    data: receiptsData,
    isLoading: isReceiptsLoading,
    isFetching: isReceiptsFetching,
  } = useReceipts(query, { placeholderData: keepPreviousData });

  const { data: receiptSettings } = useSettingsReceipts();

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isEmpty(receiptsData?.data) && !tableStateChanged && !isReceiptsLoading;

  const provider: ReceiptsListContextValue = {
    receipts: receiptsData?.data,
    pagination: receiptsData?.pagination,

    receiptsViews,
    isViewsLoading,

    resourceMeta,
    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    isResourceFetching,
    isResourceLoading,

    isReceiptsLoading,
    isReceiptsFetching,
    isEmptyStatus,

    receiptSettings,
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

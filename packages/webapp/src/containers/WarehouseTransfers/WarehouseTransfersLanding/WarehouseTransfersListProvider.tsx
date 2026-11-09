import { isEmpty } from 'lodash';
import React from 'react';
import type { IResourceField } from '@/components/AdvancedFilter/interfaces';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import type { ReactNode } from 'react';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  useResourceMeta,
  useWarehousesTransfers,
  useRefreshWarehouseTransfers,
  useSettingsWarehouseTransfers,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

interface WarehouseTransfersListProviderProps {
  query: Record<string, unknown> | null;
  tableStateChanged: boolean;
  children?: ReactNode;
}

interface WarehouseTransfersListContextValue {
  warehousesTransfers: unknown[] | undefined;
  pagination: { total?: number } | undefined;

  WarehouseTransferView: unknown;
  refresh: () => void;

  resourceMeta: unknown;
  fields: IResourceField[];
  isResourceLoading: boolean;
  isResourceFetching: boolean;

  isWarehouseTransfersLoading: boolean;
  isWarehouseTransfersFetching: boolean;
  isViewsLoading: boolean;
  isEmptyStatus: boolean;

  warehouseTransferSettings: SettingsGroup | undefined;
}

const WarehouseTransfersListContext = React.createContext<
  WarehouseTransfersListContextValue | undefined
>(undefined);

/**
 * WarehouseTransfer data provider
 */
function WarehouseTransfersListProvider({
  query,
  tableStateChanged,
  ...props
}: WarehouseTransfersListProviderProps) {
  // warehouse transfers refresh action.
  const { refresh } = useRefreshWarehouseTransfers();

  // Warehouse transfer settings.
  const { data: warehouseTransferSettings } = useSettingsWarehouseTransfers();

  // Fetch warehouse transfers list according to the given custom view id.
  const {
    data: warehousesTransfersData,
    isFetching: isWarehouseTransfersFetching,
    isLoading: isWarehouseTransfersLoading,
  } = useWarehousesTransfers(
    query as Record<string, string | number | boolean | undefined> | null,
  );

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isEmpty(warehousesTransfersData?.data) &&
    !tableStateChanged &&
    !isWarehouseTransfersLoading;

  // Fetch create notes resource views and fields.
  const { data: WarehouseTransferView, isLoading: isViewsLoading } =
    useResourceViews('warehouse_transfer');

  // Fetch the accounts resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('warehouse_transfer');

  // Provider payload.
  const provider: WarehouseTransfersListContextValue = {
    warehousesTransfers: warehousesTransfersData?.data,
    pagination: warehousesTransfersData?.pagination,

    WarehouseTransferView,
    refresh,

    resourceMeta,
    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(
          resourceMeta.fields as Record<string, unknown>,
        )
      : [],
    isResourceLoading,
    isResourceFetching,

    isWarehouseTransfersLoading,
    isWarehouseTransfersFetching,
    isViewsLoading,
    isEmptyStatus,

    warehouseTransferSettings,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'warehouse-transfers-list'}
    >
      <WarehouseTransfersListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useWarehouseTranfersListContext = () =>
  React.useContext(
    WarehouseTransfersListContext,
  ) as WarehouseTransfersListContextValue;

export { WarehouseTransfersListProvider, useWarehouseTranfersListContext };

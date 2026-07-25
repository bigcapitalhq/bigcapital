import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import { ITEMS_FILTER_ROLES_QUERY } from './utils';
import type {
  WarehouseTransferFormContextValue,
  WarehouseTransferItemCostQuery,
  WarehouseTransferSubmitPayload,
} from './types';
import { DashboardInsider } from '@/components';
import { Features } from '@/constants';
import {
  useItems,
  useWarehouses,
  useWarehouseTransfer,
  useCreateWarehouseTransfer,
  useEditWarehouseTransfer,
  useItemInventoryCost,
  useSettingsWarehouseTransfers,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

const WarehouseFormContext = createContext<
  WarehouseTransferFormContextValue | undefined
>(undefined);

interface WarehouseTransferFormProviderProps {
  warehouseTransferId?: number;
  children: React.ReactNode;
}

/**
 * Warehouse transfer form provider.
 */
function WarehouseTransferFormProvider({
  warehouseTransferId,
  children,
}: WarehouseTransferFormProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  // Handle fetch Items data table or list
  const {
    data: itemsData,
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: ITEMS_FILTER_ROLES_QUERY,
  });

  // Handle fetch warehouse transfer detail.
  const { data: warehouseTransfer, isLoading: isWarehouseTransferLoading } =
    useWarehouseTransfer(warehouseTransferId, {
      enabled: !!warehouseTransferId,
    });

  // Handle fetch warehouse transfer settings.
  const { data: warehouseTransferSettings } = useSettingsWarehouseTransfers();
  // Fetch warehouses list.
  const {
    data: warehouses,
    isFetching: isWarehouesFetching,
    isLoading: isWarehouesLoading,
  } = useWarehouses({}, { enabled: isWarehouseFeatureCan });

  // Inventory items cost query.
  const [itemCostQuery, setItemCostQuery] =
    React.useState<WarehouseTransferItemCostQuery | null>(null);

  // Detarmines whether the inventory items cost query is enabled.
  const isItemsCostQueryEnabled =
    !isEmpty(itemCostQuery?.date) && !isEmpty(itemCostQuery?.itemsIds);

  // Retrieves the inventory item cost.
  const {
    data: inventoryItemsCost,
    isLoading: isItemsCostLoading,
    isFetching: isItemsCostFetching,
    isSuccess: isItemsCostSuccess,
  } = useItemInventoryCost(
    {
      date: itemCostQuery?.date ?? '',
      itemsIds: (itemCostQuery?.itemsIds ?? []).map(String),
    },
    {
      enabled: isItemsCostQueryEnabled,
    },
  );
  // Create and edit warehouse mutations.
  const { mutateAsync: createWarehouseTransferMutate } =
    useCreateWarehouseTransfer();
  const { mutateAsync: editWarehouseTransferMutate } =
    useEditWarehouseTransfer();

  // Detarmines whether the form in new mode.
  const isNewMode = !warehouseTransferId;

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState<
    WarehouseTransferSubmitPayload | undefined
  >();

  // Provider payload.
  const provider: WarehouseTransferFormContextValue = {
    items: itemsData?.data ?? [],
    warehouses,
    warehouseTransfer,

    isItemsFetching,
    isWarehouesFetching,

    isNewMode,
    submitPayload,
    setSubmitPayload,
    createWarehouseTransferMutate,
    editWarehouseTransferMutate,

    inventoryItemsCost,
    isItemsCostLoading,
    isItemsCostFetching,
    isItemsCostSuccess,
    itemCostQuery,
    setItemCostQuery,

    warehouseTransferSettings,
  };

  return (
    <DashboardInsider
      loading={
        isItemsLoading || isWarehouesLoading || isWarehouseTransferLoading
      }
      name={'warehouse-transfer-form'}
    >
      <WarehouseFormContext.Provider value={provider} children={children} />
    </DashboardInsider>
  );
}
const useWarehouseTransferFormContext = () =>
  React.useContext(WarehouseFormContext) as WarehouseTransferFormContextValue;

export { WarehouseTransferFormProvider, useWarehouseTransferFormContext };

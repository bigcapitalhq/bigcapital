// @ts-nocheck
import React, { createContext } from 'react';
import { isEmpty } from 'lodash';
import { DashboardInsider } from '@/components';
import {
  useItems,
  useWarehouses,
  useWarehouseTransfer,
  useCreateWarehouseTransfer,
  useEditWarehouseTransfer,
  useItemInventoryCost,
} from '@/hooks/query';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { ITEMS_FILTER_ROLES_QUERY } from './utils';

const WarehouseFormContext = createContext();

/**
 * Warehouse transfer form provider.
 */
function WarehouseTransferFormProvider({ warehouseTransferId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  // Handle fetch Items data table or list
  const {
    data: { items },
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
  // Fetch warehouses list.
  const {
    data: warehouses,
    isFetching: isWarehousesFetching,
    isLoading: isWarehousesLoading,
  } = useWarehouses({}, { enabled: isWarehouseFeatureCan });

  // Inventory items cost query.
  const [itemCostQuery, setItemCostQuery] = React.useState(null);

  // Determines whether the inventory items cost query is enabled.
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
      date: itemCostQuery?.date,
      items_ids: itemCostQuery?.itemsIds,
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

  // Determines whether the form in new mode.
  const isNewMode = !warehouseTransferId;

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState();

  // Provider payload.
  const provider = {
    items,
    warehouses,
    warehouseTransfer,

    isItemsFetching,
    isWarehousesFetching,

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
  };

  return (
    <DashboardInsider
      loading={
        isItemsLoading || isWarehousesLoading || isWarehouseTransferLoading
      }
      name={'warehouse-transfer-form'}
    >
      <WarehouseFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}
const useWarehouseTransferFormContext = () =>
  React.useContext(WarehouseFormContext);

export { WarehouseTransferFormProvider, useWarehouseTransferFormContext };

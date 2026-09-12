import React, { createContext, useState } from 'react';
import type { InventoryAdjustmentContextValue, SubmitPayload } from './types';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import {
  useItem,
  useAccounts,
  useBranches,
  useWarehouses,
  useCreateInventoryAdjustment,
  useEditInventoryAdjustment,
  useInventoryAdjustment,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

const InventoryAdjustmentContext =
  createContext<InventoryAdjustmentContextValue>(
    {} as InventoryAdjustmentContextValue,
  );

interface InventoryAdjustmentFormProviderProps {
  itemId?: number | null;
  inventoryId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

function InventoryAdjustmentFormProvider({
  itemId,
  inventoryId,
  dialogName,
  ...props
}: InventoryAdjustmentFormProviderProps) {
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);

  const isEditMode = !!inventoryId;

  const { isFetching: isAccountsLoading, data: accounts } = useAccounts();

  // Retrieves the inventory adjustment details once editing.
  const {
    data: inventoryAdjustment,
    isFetching: isInventoryAdjustmentLoading,
  } = useInventoryAdjustment(inventoryId, { enabled: isEditMode });

  // The item id in edit mode comes from the adjusted entry.
  const formItemId = itemId ?? inventoryAdjustment?.entries?.[0]?.itemId;

  const { isFetching: isItemLoading, data: item } = useItem(
    formItemId ?? undefined,
  );

  const {
    data: warehouses,
    isLoading: isWarehouesLoading,
    isSuccess: isWarehousesSuccess,
  } = useWarehouses({}, { enabled: isWarehouseFeatureCan });

  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches({}, { enabled: isBranchFeatureCan });

  const { mutateAsync: createInventoryAdjMutate } =
    useCreateInventoryAdjustment();

  const { mutateAsync: editInventoryAdjMutate } = useEditInventoryAdjustment();

  const [submitPayload, setSubmitPayload] = useState<SubmitPayload>({});

  const isFeatureLoading = isWarehouesLoading || isBranchesLoading;

  const provider: InventoryAdjustmentContextValue = {
    item,
    itemId: formItemId,
    inventoryId,
    inventoryAdjustment,
    isEditMode,
    branches: branches ?? [],
    warehouses: warehouses ?? [],
    accounts: accounts ?? [],

    dialogName,
    submitPayload,

    isBranchesSuccess,
    isWarehousesSuccess,
    isAccountsLoading,
    isItemLoading,
    isFeatureLoading,
    isWarehouesLoading,
    isBranchesLoading,

    createInventoryAdjMutate,
    editInventoryAdjMutate,
    setSubmitPayload,
  };

  return (
    <DialogContent
      isLoading={
        isAccountsLoading || isItemLoading || isInventoryAdjustmentLoading
      }
    >
      <InventoryAdjustmentContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useInventoryAdjContext = () =>
  React.useContext(InventoryAdjustmentContext);

export { InventoryAdjustmentFormProvider, useInventoryAdjContext };

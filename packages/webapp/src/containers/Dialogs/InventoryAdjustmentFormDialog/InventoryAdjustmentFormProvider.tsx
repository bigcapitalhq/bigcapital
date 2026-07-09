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
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

const InventoryAdjustmentContext =
  createContext<InventoryAdjustmentContextValue>(
    {} as InventoryAdjustmentContextValue,
  );

interface InventoryAdjustmentFormProviderProps {
  itemId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

function InventoryAdjustmentFormProvider({
  itemId,
  dialogName,
  ...props
}: InventoryAdjustmentFormProviderProps) {
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);

  const { isFetching: isAccountsLoading, data: accounts } = useAccounts();

  const { isFetching: isItemLoading, data: item } = useItem(
    itemId ?? undefined,
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

  const [submitPayload, setSubmitPayload] = useState<SubmitPayload>({});

  const isFeatureLoading = isWarehouesLoading || isBranchesLoading;

  const provider: InventoryAdjustmentContextValue = {
    item,
    itemId,
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
    setSubmitPayload,
  };

  return (
    <DialogContent isLoading={isAccountsLoading || isItemLoading}>
      <InventoryAdjustmentContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useInventoryAdjContext = () =>
  React.useContext(InventoryAdjustmentContext);

export { InventoryAdjustmentFormProvider, useInventoryAdjContext };

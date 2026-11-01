import React, { createContext } from 'react';
import type { WarehouseFormContextValue } from './types';
import { DialogContent } from '@/components';
import {
  useCreateWarehouse,
  useEditWarehouse,
  useWarehouse,
} from '@/hooks/query';

const WarehouseFormContext = createContext<WarehouseFormContextValue>(
  {} as WarehouseFormContextValue,
);

interface WarehouseFormProviderProps {
  dialogName: string;
  warehouseId?: number | null;
  children?: React.ReactNode;
}

function WarehouseFormProvider({
  dialogName,
  warehouseId,
  ...props
}: WarehouseFormProviderProps) {
  const { mutateAsync: createWarehouseMutate } = useCreateWarehouse();
  const { mutateAsync: editWarehouseMutate } = useEditWarehouse();

  const { data: warehouse, isLoading: isWarehouseLoading } = useWarehouse(
    warehouseId,
    {
      enabled: !!warehouseId,
    },
  );

  const provider: WarehouseFormContextValue = {
    dialogName,
    warehouse,
    warehouseId,
    createWarehouseMutate,
    editWarehouseMutate,
  };

  return (
    <DialogContent isLoading={isWarehouseLoading}>
      <WarehouseFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useWarehouseFormContext = () => React.useContext(WarehouseFormContext);

export { WarehouseFormProvider, useWarehouseFormContext };

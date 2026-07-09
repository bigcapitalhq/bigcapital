import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import { useActivateWarehouses } from '@/hooks/query';

interface WarehouseActivateContextValue {
  activateWarehouses: (id: number) => Promise<unknown>;
  dialogName: string;
}

const WarehouseActivateContext = createContext<WarehouseActivateContextValue>(
  {} as WarehouseActivateContextValue,
);

interface WarehouseActivateFormProviderProps {
  dialogName: string;
  children?: React.ReactNode;
}

function WarehouseActivateFormProvider({
  dialogName,
  ...props
}: WarehouseActivateFormProviderProps) {
  const { mutateAsync: activateWarehouses } = useActivateWarehouses();

  const provider: WarehouseActivateContextValue = {
    activateWarehouses,
    dialogName,
  };

  return (
    <DialogContent>
      <WarehouseActivateContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useWarehouseActivateContext = () =>
  React.useContext(WarehouseActivateContext);

export { WarehouseActivateFormProvider, useWarehouseActivateContext };

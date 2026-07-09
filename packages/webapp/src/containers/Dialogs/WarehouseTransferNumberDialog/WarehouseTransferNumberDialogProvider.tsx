import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import { useSettingsWarehouseTransfers } from '@/hooks/query';

interface WarehouseTransferNumberDialogContextValue {
  isSettingsLoading: boolean;
}

const WarehouseTransferNumberDilaogContext =
  createContext<WarehouseTransferNumberDialogContextValue>(
    {} as WarehouseTransferNumberDialogContextValue,
  );

interface WarehouseTransferNumberDialogProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

function WarehouseTransferNumberDialogProvider({
  ...props
}: WarehouseTransferNumberDialogProviderProps) {
  const { isLoading: isSettingsLoading } = useSettingsWarehouseTransfers();

  const provider: WarehouseTransferNumberDialogContextValue = {
    isSettingsLoading,
  };

  return (
    <DialogContent isLoading={isSettingsLoading}>
      <WarehouseTransferNumberDilaogContext.Provider
        value={provider}
        {...props}
      />
    </DialogContent>
  );
}

const useWarehouseTransferNumberDialogContext = () =>
  React.useContext(WarehouseTransferNumberDilaogContext);

export {
  WarehouseTransferNumberDialogProvider,
  useWarehouseTransferNumberDialogContext,
};

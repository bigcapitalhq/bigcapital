// @ts-nocheck
import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import { useSettingsWarehouseTransfers } from '@/hooks/query';

const WarehouseTransferNumberDialogContext = createContext();

/**
 * Warehouse transfer number dialog provider.
 */
function WarehouseTransferNumberDialogProvider({ query, ...props }) {
  const { isLoading: isSettingsLoading } = useSettingsWarehouseTransfers();

  // Provider payload.
  const provider = {
    isSettingsLoading,
  };

  return (
    <DialogContent isLoading={isSettingsLoading}>
      <WarehouseTransferNumberDialogContext.Provider
        value={provider}
        {...props}
      />
    </DialogContent>
  );
}

const useWarehouseTransferNumberDialogContext = () =>
  React.useContext(WarehouseTransferNumberDialogContext);

export {
  WarehouseTransferNumberDialogProvider,
  useWarehouseTransferNumberDialogContext,
};

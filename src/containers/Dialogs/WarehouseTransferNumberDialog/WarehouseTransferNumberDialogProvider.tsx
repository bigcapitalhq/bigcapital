import React from 'react';
import { DialogContent } from '@/components';
import { useSettingsWarehouseTransfers } from 'hooks/query';

const WarehouseTransferNumberDilaogContext = React.createContext();

/**
 * Warehouse transfer number dialog provier.
 */
function WarehouseTransferNumberDialogProvider({ query, ...props }) {
  const { isLoading: isSettingsLoading } = useSettingsWarehouseTransfers();

  // Provider payload.
  const provider = {
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

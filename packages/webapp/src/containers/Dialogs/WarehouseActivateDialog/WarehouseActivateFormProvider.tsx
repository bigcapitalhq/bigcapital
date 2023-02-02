// @ts-nocheck
import React from 'react';

import { DialogContent } from '@/components';
import { useActivateWarehouses } from '@/hooks/query';

const WarehouseActivateContext = React.createContext();

/**
 * warehouse activate form provider.
 */
function WarehouseActivateFormProvider({ dialogName, ...props }) {
  const { mutateAsync: activateWarehouses } = useActivateWarehouses();

  // State provider.
  const provider = {
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

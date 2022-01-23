import React from 'react';
import { DialogContent } from 'components';
// import {} from 'hooks/query';

const WarehouseFormContext = React.createContext();

/**
 * Warehouse form provider.
 */
function WarehouseFormProvider({ dialogName, ...props }) {
  // State provider.
  const provider = {
    dialogName,
  };

  return (
    <DialogContent
    // isLoading={}
    >
      <WarehouseFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useWarehouseFormContext = () => React.useContext(WarehouseFormContext);

export { WarehouseFormProvider, useWarehouseFormContext };

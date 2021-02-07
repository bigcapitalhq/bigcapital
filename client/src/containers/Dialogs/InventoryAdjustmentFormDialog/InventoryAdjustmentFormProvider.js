import React, { useState, createContext } from 'react';
import { DialogContent } from 'components';
import {
  useItem,
  useAccounts,
  useCreateInventoryAdjustment,
} from 'hooks/query';

const InventoryAdjustmentContext = createContext();

/**
 * Inventory adjustment dialog provider.
 */
function InventoryAdjustmentFormProvider({ itemId, dialogName, ...props }) {
  // Fetches accounts list.
  const { isFetching: isAccountsLoading, data: accounts } = useAccounts();

  // Fetches the item details.
  const { isFetching: isItemLoading, data: item } = useItem(itemId);

  const {
    mutateAsync: createInventoryAdjMutate,
  } = useCreateInventoryAdjustment();

  // Submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  // State provider.
  const provider = {
    itemId,
    isAccountsLoading,
    accounts,
    isItemLoading,
    item,
    submitPayload,
    dialogName,
    
    createInventoryAdjMutate,
    setSubmitPayload,
  };

  return (
    <DialogContent isLoading={isAccountsLoading || isItemLoading}>
      <InventoryAdjustmentContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useInventoryAdjContext = () => React.useContext(InventoryAdjustmentContext);

export { InventoryAdjustmentFormProvider, useInventoryAdjContext };

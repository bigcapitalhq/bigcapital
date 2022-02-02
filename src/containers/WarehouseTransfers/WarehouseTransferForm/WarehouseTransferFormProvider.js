import React from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useItems,
  useWarehouses,
  useCreateWarehouseTransfer,
  useEditWarehouseTransfer,
} from 'hooks/query';
import { ITEMS_FILTER_ROLES_QUERY } from './utils.js';

const WarehouseFormContext = React.createContext();

/**
 * Warehouse transfer form provider.
 */
function WarehouseTransferFormProvider({ warehouseTransferId, ...props }) {
  // Handle fetch Items data table or list
  const {
    data: { items },
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: ITEMS_FILTER_ROLES_QUERY,
  });

  // Fetch warehouses list.
  const {
    data: warehouses,
    isFetching: isWarehouesFetching,
    isLoading: isWarehouesLoading,
  } = useWarehouses();

  // Create and edit warehouse mutations.
  const { mutateAsync: createWarehouseTransferMutate } =
    useCreateWarehouseTransfer();
  const { mutateAsync: editWarehouseTransferMutate } =
    useEditWarehouseTransfer();

  // Detarmines whether the form in new mode.
  const isNewMode = !warehouseTransferId;

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState();

  // Provider payload.
  const provider = {
    items,
    warehouses,
    warehouseTransfer: [],

    isItemsFetching,
    isWarehouesFetching,

    isNewMode,
    submitPayload,
    setSubmitPayload,
    createWarehouseTransferMutate,
    editWarehouseTransferMutate,
  };
  return (
    <DashboardInsider
      loading={isItemsLoading || isWarehouesLoading}
      name={'warehouseTransfer-form'}
    >
      <WarehouseFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}
const useWarehouseTransferFormContext = () =>
  React.useContext(WarehouseFormContext);

export { WarehouseTransferFormProvider, useWarehouseTransferFormContext };

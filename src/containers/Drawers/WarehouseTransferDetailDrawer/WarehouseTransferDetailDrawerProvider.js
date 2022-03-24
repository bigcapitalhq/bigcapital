import React from 'react';
import intl from 'react-intl-universal';
import { useWarehouseTransfer } from 'hooks/query';
import { DrawerHeaderContent, DrawerLoading } from 'components';

const WarehouseTransferDetailDrawerContext = React.createContext();

/**
 * Warehouse transfer detail drawer provider.
 */
function WarehouseTransferDetailDrawerProvider({
  warehouseTransferId,
  ...props
}) {
  // Handle fetch warehouse transfer detail.
  const { data: warehouseTransfer, isLoading: isWarehouseTransferLoading } =
    useWarehouseTransfer(warehouseTransferId, {
      enabled: !!warehouseTransferId,
    });

  const provider = {
    warehouseTransfer,
    warehouseTransferId,
  };

  return (
    <DrawerLoading loading={isWarehouseTransferLoading}>
      <DrawerHeaderContent
        name="warehouse-transfer-detail-drawer"
        title={intl.get('warehouse_transfer.drawer.title', {
          number: warehouseTransfer.transaction_number
            ? `(${warehouseTransfer.transaction_number})`
            : null,
        })}
      />
      <WarehouseTransferDetailDrawerContext.Provider
        value={provider}
        {...props}
      />
    </DrawerLoading>
  );
}

const useWarehouseDetailDrawerContext = () =>
  React.useContext(WarehouseTransferDetailDrawerContext);

export {
  WarehouseTransferDetailDrawerProvider,
  useWarehouseDetailDrawerContext,
};

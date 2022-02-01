import React from 'react';
import intl from 'react-intl-universal';
// import {} from 'hooks/query';
import { DrawerHeaderContent, DrawerLoading } from 'components';

const WarehouseTransferDetailDrawerContext = React.createContext();

/**
 * Warehouse transfer detail drawer provider.
 */
function WarehouseTransferDetailDrawerProvider({
  warehouseTransferId,
  ...props
}) {
  const provider = {
    warehouseTransferId,
  };

  return (
    <DrawerLoading
    // loading={}
    >
      <DrawerHeaderContent
        name="warehouse-transfer-detail-drawer"
        title={intl.get('warehouse_transfer.drawer.title', {
          number: 'W-10',
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

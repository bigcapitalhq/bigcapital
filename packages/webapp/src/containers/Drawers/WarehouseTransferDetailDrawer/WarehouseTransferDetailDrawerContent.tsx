// @ts-nocheck
import React from 'react';
import { DrawerBody } from '@/components';

import WarehouseTransferDetail from './WarehouseTransferDetail';
import { WarehouseTransferDetailDrawerProvider } from './WarehouseTransferDetailDrawerProvider';

/**
 * Warehouse transfer detail drawer content.
 */
export default function WarehouseTransferDetailDrawerContent({
  // #ownProp
  warehouseTransferId,
}) {
  return (
    <WarehouseTransferDetailDrawerProvider
      warehouseTransferId={warehouseTransferId}
    >
      <DrawerBody>
        <WarehouseTransferDetail />
      </DrawerBody>
    </WarehouseTransferDetailDrawerProvider>
  );
}

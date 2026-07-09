import React from 'react';
import { WarehouseTransferDetail } from './WarehouseTransferDetail';
import { WarehouseTransferDetailDrawerProvider } from './WarehouseTransferDetailDrawerProvider';
import { DrawerBody } from '@/components';

interface WarehouseTransferDetailDrawerContentProps {
  warehouseTransferId?: number | null;
}

export function WarehouseTransferDetailDrawerContent({
  warehouseTransferId,
}: WarehouseTransferDetailDrawerContentProps): React.ReactElement {
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

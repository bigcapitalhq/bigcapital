import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const WarehouseTransferDetailDrawerContent = lazy(() =>
  import('./WarehouseTransferDetailDrawerContent').then((m) => ({
    default: m.WarehouseTransferDetailDrawerContent,
  })),
);

interface WarehouseTransferDetailDrawerProps {
  name: string;
  isOpen: boolean;
  payload: { warehouseTransferId?: number | null } & Record<string, unknown>;
}

function WarehouseTransferDetailDrawer({
  name,
  isOpen,
  payload: { warehouseTransferId },
}: WarehouseTransferDetailDrawerProps): React.ReactElement {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <WarehouseTransferDetailDrawerContent
          warehouseTransferId={warehouseTransferId}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = FF.pipe(WarehouseTransferDetailDrawer, withDrawers());

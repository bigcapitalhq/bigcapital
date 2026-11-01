import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const ReceiptCustomizeDrawerBody = React.lazy(() =>
  import('./ReceiptCustomizeDrawerBody').then((m) => ({
    default: m.ReceiptCustomizeDrawerBody,
  })),
);

interface ReceiptCustomizeDrawerProps {
  name: string;
  isOpen?: boolean;
  payload?: Record<string, any>;
}

/**
 * Receipt customize drawer.
 * @returns {React.ReactNode}
 */
function ReceiptCustomizeDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}: ReceiptCustomizeDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      payload={payload}
      size={'calc(100% - 10px)'}
    >
      <DrawerSuspense>
        <ReceiptCustomizeDrawerBody />
      </DrawerSuspense>
    </Drawer>
  );
}

export const ReceiptCustomizeDrawer = FF.pipe(
  ReceiptCustomizeDrawerRoot,
  withDrawers(),
);

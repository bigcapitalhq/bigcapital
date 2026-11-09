import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const ReceiptSendMailContent = React.lazy(() =>
  import('./ReceiptSendMailContent').then((module) => ({
    default: module.ReceiptSendMailContent,
  })),
);

interface ReceiptSendMailDrawerProps {
  name: string;
  isOpen?: boolean;
  payload?: any;
}

function ReceiptSendMailDrawerRoot({
  name,

  // #withDrawer
  isOpen,
  payload,
}: ReceiptSendMailDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      payload={payload}
      size={'calc(100% - 10px)'}
    >
      <DrawerSuspense>
        <ReceiptSendMailContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const ReceiptSendMailDrawer = FF.pipe(
  ReceiptSendMailDrawerRoot,
  withDrawers(),
);

// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

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

export const ReceiptSendMailDrawer = R.compose(withDrawers())(
  ReceiptSendMailDrawerRoot,
);

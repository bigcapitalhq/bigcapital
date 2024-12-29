// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const PaymentReceivedMailContent = React.lazy(() =>
  import('./PaymentReceivedMailContent').then((module) => ({
    default: module.PaymentReceivedSendMailContent,
  })),
);

interface PaymentReceivedSendMailDrawerProps {
  name: string;
  isOpen?: boolean;
  payload?: any;
}

function PaymentReceivedSendMailDrawerRoot({
  name,

  // #withDrawer
  isOpen,
  payload,
}: PaymentReceivedSendMailDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      payload={payload}
      size={'calc(100% - 10px)'}
    >
      <DrawerSuspense>
        <PaymentReceivedMailContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const PaymentReceivedSendMailDrawer = R.compose(withDrawers())(
  PaymentReceivedSendMailDrawerRoot,
);

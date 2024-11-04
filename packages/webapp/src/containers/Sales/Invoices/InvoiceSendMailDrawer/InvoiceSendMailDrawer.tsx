// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const InvoiceSendMailContent = React.lazy(() =>
  import('./InvoiceSendMailContent').then((module) => ({
    default: module.InvoiceSendMailContent,
  })),
);

interface InvoiceSendMailDrawerProps {
  name: string;
  isOpen?: boolean;
  payload?: any;
}

function InvoiceSendMailDrawerRoot({
  name,

  // #withDrawer
  isOpen,
  payload,
}: InvoiceSendMailDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      payload={payload}
      size={'calc(100% - 10px)'}
    >
      <DrawerSuspense>
        <InvoiceSendMailContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const InvoiceSendMailDrawer = R.compose(withDrawers())(
  InvoiceSendMailDrawerRoot,
);

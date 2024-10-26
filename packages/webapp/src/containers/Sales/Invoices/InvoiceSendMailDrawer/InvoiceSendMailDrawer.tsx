import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';
import React from 'react';

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
    <Drawer isOpen={isOpen} name={name} size={'100%'} payload={payload}>
      <DrawerSuspense>
        <InvoiceSendMailContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const InvoiceSendMailDrawer = R.compose(withDrawers())(
  InvoiceSendMailDrawerRoot,
);

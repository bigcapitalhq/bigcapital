// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const CustomerDetailsDrawerContent = React.lazy(() =>
  import('./CustomerDetailsDrawerContent').then((m) => ({
    default: m.CustomerDetailsDrawerContent,
  })),
);

/**
 * Contact detail drawer.
 */
function CustomerDetailsDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { customerId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <CustomerDetailsDrawerContent customerId={customerId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = flow(withDrawers())(CustomerDetailsDrawer);

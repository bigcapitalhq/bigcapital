// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const VendorCreditDetailDrawerContent = React.lazy(() =>
  import('./VendorCreditDetailDrawerContent').then((m) => ({
    default: m.VendorCreditDetailDrawerContent,
  })),
);

/**
 * Vendor Credit detail drawer.
 */
function VendorCreditDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { vendorCreditId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <VendorCreditDetailDrawerContent vendorCreditId={vendorCreditId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = flow(withDrawers())(VendorCreditDetailDrawer);

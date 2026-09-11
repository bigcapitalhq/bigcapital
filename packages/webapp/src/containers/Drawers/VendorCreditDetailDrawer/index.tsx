import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';

const VendorCreditDetailDrawerContent = React.lazy(() =>
  import('./VendorCreditDetailDrawerContent').then((m) => ({
    default: m.VendorCreditDetailDrawerContent,
  })),
);

interface VendorCreditDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Vendor Credit detail drawer.
 */
function VendorCreditDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: VendorCreditDetailDrawerProps) {
  const vendorCreditId = payload?.vendorCreditId as number | undefined;

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

export const index = FF.pipe(VendorCreditDetailDrawer, withDrawers());

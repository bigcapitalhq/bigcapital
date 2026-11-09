import * as FF from 'fp-ts/function';
import { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const VendorDetailsDrawerContent = lazy(() =>
  import('./VendorDetailsDrawerContent').then((m) => ({
    default: m.VendorDetailsDrawerContent,
  })),
);

interface VendorDetailsDrawerProps {
  name: string;
  isOpen: boolean;
  payload: { vendorId?: number };
}

/**
 * Vendor details drawer.
 */
function VendorDetailsDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { vendorId },
}: VendorDetailsDrawerProps) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <VendorDetailsDrawerContent vendorId={vendorId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = FF.pipe(VendorDetailsDrawer, withDrawers());

import { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

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

export const index = compose(withDrawers())(VendorDetailsDrawer);

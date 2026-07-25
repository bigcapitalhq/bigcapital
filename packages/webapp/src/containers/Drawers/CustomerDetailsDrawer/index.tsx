import { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const CustomerDetailsDrawerContent = lazy(() =>
  import('./CustomerDetailsDrawerContent').then((m) => ({
    default: m.CustomerDetailsDrawerContent,
  })),
);

interface CustomerDetailsDrawerProps {
  name: string;
  isOpen: boolean;
  payload: { customerId?: number };
}

/**
 * Contact detail drawer.
 */
function CustomerDetailsDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { customerId },
}: CustomerDetailsDrawerProps) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <CustomerDetailsDrawerContent customerId={customerId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = compose(withDrawers())(CustomerDetailsDrawer);

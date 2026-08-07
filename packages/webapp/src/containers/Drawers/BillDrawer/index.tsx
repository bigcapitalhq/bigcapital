import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const BillDrawerContent = React.lazy(() =>
  import('./BillDrawerContent').then((m) => ({ default: m.BillDrawerContent })),
);

interface BillDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Bill drawer.
 */
function BillDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: BillDrawerProps) {
  const billId = payload?.billId as number | undefined;

  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <BillDrawerContent billId={billId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = compose(withDrawers())(BillDrawer);

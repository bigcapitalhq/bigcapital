import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import {
  withDrawers,
  type WithDrawersProps,
} from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const ItemDetailDrawerContent = React.lazy(() =>
  import('./ItemDetailDrawerContent').then((m) => ({
    default: m.ItemDetailDrawerContent,
  })),
);

interface ItemDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Item Detail drawer.
 */
function ItemDetailDrawer({ name, isOpen, payload }: ItemDetailDrawerProps) {
  const itemId = payload?.itemId as number | undefined;

  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <ItemDetailDrawerContent itemId={itemId} />
      </DrawerSuspense>
    </Drawer>
  );
}
export const index = compose(withDrawers())(ItemDetailDrawer);
